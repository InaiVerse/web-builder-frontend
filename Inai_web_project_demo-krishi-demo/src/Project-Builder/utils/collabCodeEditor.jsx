import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { ProjectCollaboration } from './collaboration.js';
import socketService from '../../services/socketService';
import Cookies from 'js-cookie';
import { formatCodeByType, ensureLineBreaks } from './codeFormatter';

const CollaborativeCodeEditor = ({ 
    code, 
    language, 
    onChange, 
    theme = 'vs-dark',
    projectId,
    filePath,
    userId,
    onRemoteChange,
    onUserActivity,
    filename
}) => {
    const editorRef = useRef(null);
    const collaborationRef = useRef(null);
    const [activeUsers, setActiveUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // Format the code content to ensure proper line breaks and formatting
    const formattedCode = React.useMemo(() => {
        if (!code) return '';
        const withLineBreaks = ensureLineBreaks(code);
        return filename ? formatCodeByType(withLineBreaks, filename) : withLineBreaks;
    }, [code, filename]);

    // Use the shared socket service instead of creating a new connection
    useEffect(() => {
        if (!projectId || !userId) return;

        // Check socket service connection status
        const checkConnection = () => {
            const status = socketService.getConnectionStatus();
            setIsConnected(status.isConnected);
            
            if (status.isConnected && socketService.socket) {
                // Initialize collaboration if not already done
                if (!collaborationRef.current) {
                    collaborationRef.current = new ProjectCollaboration(
                        socketService.socket,
                        userId,
                        projectId
                    );
                }

                // Setup collaboration callbacks
                setupCollaborationCallbacks();
                
                // Set current file
                collaborationRef.current.setCurrentFile(filePath);
            }
        };

        // Check connection immediately and then periodically
        checkConnection();
        const interval = setInterval(checkConnection, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [projectId, userId, filePath]);

    const setupCollaborationCallbacks = () => {
        if (!collaborationRef.current) return;

        // Setup collaboration callbacks
        collaborationRef.current.onFileChanged = (data) => {
            if (data.file_path === filePath && onRemoteChange) {
                onRemoteChange(data.content, data.operation, data.changed_by);
            }
        };

        collaborationRef.current.onActiveUsersUpdated = (data) => {
            setActiveUsers(data.users || []);
            if (onUserActivity) {
                onUserActivity({ type: 'users_updated', users: data.users });
            }
        };

        collaborationRef.current.onUserTyping = (data) => {
            if (data.file_path === filePath && onUserActivity) {
                onUserActivity({ 
                    type: 'typing', 
                    userId: data.user_id, 
                    isTyping: data.is_typing 
                });
            }
        };

        collaborationRef.current.onCursorPosition = (data) => {
            if (data.file_path === filePath && onUserActivity) {
                onUserActivity({ 
                    type: 'cursor', 
                    userId: data.user_id, 
                    line: data.line, 
                    column: data.column 
                });
            }
        };

        collaborationRef.current.onTextSelection = (data) => {
            if (data.file_path === filePath && onUserActivity) {
                onUserActivity({ 
                    type: 'selection', 
                    userId: data.user_id, 
                    start: data.start, 
                    end: data.end 
                });
            }
        };
    };

    // Update current file when filePath changes
    useEffect(() => {
        if (collaborationRef.current && filePath) {
            collaborationRef.current.setCurrentFile(filePath);
        }
    }, [filePath]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Setup editor change handler
        editor.onDidChangeModelContent((event) => {
            const content = editor.getValue();
            
            // Send collaboration events through socket service
            if (isConnected && filePath) {
                socketService.sendFileChange(filePath, content, 'update');
                socketService.sendTypingStatus(filePath, true);
            }

            // Call parent onChange
            if (onChange) {
                onChange(content);
            }
        });

        // Setup cursor position handler
        editor.onDidChangeCursorPosition((event) => {
            if (isConnected && filePath) {
                const position = event.position;
                socketService.sendCursorPosition(
                    filePath, 
                    position.lineNumber, 
                    position.column
                );
            }
        });

        // Setup selection handler
        editor.onDidChangeCursorSelection((event) => {
            if (isConnected && filePath) {
                const selection = event.selection;
                if (!selection.isEmpty()) {
                    socketService.sendTextSelection(
                        filePath,
                        { line: selection.startLineNumber, column: selection.startColumn },
                        { line: selection.endLineNumber, column: selection.endColumn }
                    );
                }
            }
        });
    };

    const handleRemoteContentChange = (content) => {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            if (model && model.getValue() !== content) {
                // Save current cursor position
                const position = editorRef.current.getPosition();
                
                // Apply remote changes
                model.setValue(content);
                
                // Restore cursor position
                editorRef.current.setPosition(position);
            }
        }
    };

    // Apply remote changes when received
    useEffect(() => {
        if (code !== undefined && editorRef.current) {
            const formattedContent = formattedCode;
            handleRemoteContentChange(formattedContent);
        }
    }, [formattedCode]);

    return (
        <div className="relative w-full h-full">
            {/* Connection status indicator */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>

            {/* Active users indicator */}
            {activeUsers.length > 0 && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                    <span className="text-xs text-gray-500">
                        {activeUsers.length} active
                    </span>
                </div>
            )}

            {/* Monaco Editor */}
            <Editor
                height="100%"
                defaultLanguage={language || 'javascript'}
                language={language || 'javascript'}
                value={formattedCode}
                theme={theme}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    // Disable some features that might interfere with collaboration
                    occurrencesHighlight: false,
                    renderLineHighlight: 'none',
                    selectionHighlight: false,
                }}
            />
        </div>
    );
};

export default CollaborativeCodeEditor;
