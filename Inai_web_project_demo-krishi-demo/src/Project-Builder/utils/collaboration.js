/**
 * Frontend JavaScript implementation for real-time project collaboration
 * Connects to Socket.IO server for live file editing, cursor positions, and user presence
 */

export class ProjectCollaboration {
    constructor(socket, userId, projectId) {
        this.socket = socket;
        this.userId = userId;
        this.projectId = projectId;
        this.currentFile = null;
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.setupEventListeners();
        this.joinProject();
    }

    setupEventListeners() {
        // Connection events
        this.socket.on('joined_project', (data) => {
            console.log('Joined project:', data.project_id);
            this.onProjectJoined?.(data);
        });

        this.socket.on('user_joined', (data) => {
            console.log('User joined:', data);
            this.onUserJoined?.(data);
        });

        this.socket.on('user_left', (data) => {
            console.log('User left:', data);
            this.onUserLeft?.(data);
        });

        this.socket.on('active_users', (data) => {
            console.log('Active users:', data);
            this.onActiveUsersUpdated?.(data);
        });

        // File collaboration events
        this.socket.on('file_changed', (data) => {
            console.log('File changed:', data);
            this.handleFileChange(data);
        });

        this.socket.on('cursor_position', (data) => {
            console.log('Cursor position:', data);
            this.handleCursorPosition(data);
        });

        this.socket.on('text_selection', (data) => {
            console.log('Text selection:', data);
            this.handleTextSelection(data);
        });

        this.socket.on('user_typing', (data) => {
            console.log('User typing:', data);
            this.handleUserTyping(data);
        });

        // Error handling
        this.socket.on('error', (data) => {
            console.error('Socket error:', data);
            this.onError?.(data);
        });

        // Disconnect handling
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.onDisconnected?.();
        });
    }

    joinProject() {
        this.socket.emit('join_project', {
            user_id: this.userId,
            project_id: this.projectId
        });
    }

    // File operations
    sendFileChange(filePath, content, operation = 'update') {
        this.socket.emit('file_change', {
            file_path: filePath,
            content: content,
            operation: operation
        });
    }

    handleFileChange(data) {
        if (data.changed_by === this.userId) return; // Ignore own changes
        
        this.onFileChanged?.(data);
        
        // Update editor content if it's the current file
        if (this.currentFile === data.file_path) {
            this.updateEditorContent(data.content, data.operation);
        }
    }

    updateEditorContent(content, operation) {
        // This should be implemented by the editor component
        this.onEditorUpdate?.(content, operation);
    }

    // Cursor position
    sendCursorPosition(filePath, line, column) {
        this.socket.emit('cursor_position', {
            file_path: filePath,
            line: line,
            column: column
        });
    }

    handleCursorPosition(data) {
        if (data.user_id === this.userId) return; // Ignore own cursor
        
        this.onCursorPosition?.(data);
    }

    // Text selection
    sendTextSelection(filePath, start, end) {
        this.socket.emit('text_selection', {
            file_path: filePath,
            start: start,
            end: end
        });
    }

    handleTextSelection(data) {
        if (data.user_id === this.userId) return; // Ignore own selection
        
        this.onTextSelection?.(data);
    }

    // Typing indicators
    sendTypingStatus(filePath, isTyping) {
        // Clear existing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        this.isTyping = isTyping;
        this.socket.emit('user_typing', {
            file_path: filePath,
            is_typing: isTyping
        });

        // Auto-stop typing after 2 seconds
        if (isTyping) {
            this.typingTimeout = setTimeout(() => {
                if (this.isTyping) {
                    this.sendTypingStatus(filePath, false);
                }
            }, 2000);
        }
    }

    handleUserTyping(data) {
        if (data.user_id === this.userId) return; // Ignore own typing
        
        this.onUserTyping?.(data);
    }

    // Utility methods
    setCurrentFile(filePath) {
        this.currentFile = filePath;
    }

    leaveProject() {
        this.socket.disconnect();
    }

    // Event callbacks (to be set by the consuming component)
    onProjectJoined = null;
    onUserJoined = null;
    onUserLeft = null;
    onActiveUsersUpdated = null;
    onFileChanged = null;
    onEditorUpdate = null;
    onCursorPosition = null;
    onTextSelection = null;
    onUserTyping = null;
    onError = null;
    onDisconnected = null;
}

// Example usage with a code editor (like Monaco or CodeMirror)
export class CollaborativeEditor {
    constructor(editorElement, socket, userId, projectId) {
        this.editor = this.initializeEditor(editorElement);
        this.collaboration = new ProjectCollaboration(socket, userId, projectId);
        
        this.setupEditorEvents();
        this.setupCollaborationCallbacks();
    }

    initializeEditor(element) {
        // Initialize your preferred editor here
        // This is a placeholder for Monaco Editor, CodeMirror, etc.
        return {
            getValue: () => element.value || '',
            setValue: (value) => { element.value = value; },
            getPosition: () => ({ line: 1, column: 1 }),
            getSelection: () => ({ start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }),
            onDidChangeContent: (callback) => {
                element.addEventListener('input', callback);
            },
            onDidChangeCursorPosition: (callback) => {
                element.addEventListener('keyup', callback);
                element.addEventListener('click', callback);
            }
        };
    }

    setupEditorEvents() {
        // Content changes
        this.editor.onDidChangeContent(() => {
            const content = this.editor.getValue();
            this.collaboration.sendFileChange(this.currentFile, content);
            this.collaboration.sendTypingStatus(this.currentFile, true);
        });

        // Cursor position changes
        this.editor.onDidChangeCursorPosition(() => {
            const pos = this.editor.getPosition();
            this.collaboration.sendCursorPosition(this.currentFile, pos.line, pos.column);
        });

        // Selection changes
        this.editor.onDidChangeCursorPosition(() => {
            const selection = this.editor.getSelection();
            this.collaboration.sendTextSelection(this.currentFile, selection.start, selection.end);
        });
    }

    setupCollaborationCallbacks() {
        this.collaboration.onFileChanged = (data) => {
            if (data.file_path === this.currentFile) {
                // Apply remote changes to editor
                const cursor = this.editor.getPosition();
                this.editor.setValue(data.content);
                // Restore cursor position
                this.editor.setPosition(cursor);
            }
        };

        this.collaboration.onCursorPosition = (data) => {
            // Show remote user cursor
            this.showRemoteCursor(data.user_id, data.line, data.column);
        };

        this.collaboration.onTextSelection = (data) => {
            // Show remote user selection
            this.showRemoteSelection(data.user_id, data.start, data.end);
        };

        this.collaboration.onUserTyping = (data) => {
            // Show typing indicator
            this.showTypingIndicator(data.user_id, data.is_typing);
        };

        this.collaboration.onActiveUsersUpdated = (data) => {
            // Update active users list
            this.updateActiveUsersList(data.users);
        };
    }

    // Helper methods for UI updates
    showRemoteCursor(userId, line, column) {
        // Implement remote cursor visualization
        console.log(`User ${userId} cursor at line ${line}, column ${column}`);
    }

    showRemoteSelection(userId, start, end) {
        // Implement remote selection visualization
        console.log(`User ${userId} selected from ${start.line}:${start.column} to ${end.line}:${end.column}`);
    }

    showTypingIndicator(userId, isTyping) {
        // Implement typing indicator
        console.log(`User ${userId} is typing: ${isTyping}`);
    }

    updateActiveUsersList(users) {
        // Update UI with active users
        console.log('Active users:', users);
    }

    openFile(filePath) {
        this.currentFile = filePath;
        this.collaboration.setCurrentFile(filePath);
        // Load file content into editor
        this.loadFileContent(filePath);
    }

    loadFileContent(filePath) {
        // Implement file loading logic
        console.log('Loading file:', filePath);
    }

    // Public API
    getCurrentContent() {
        return this.editor.getValue();
    }

    setContent(content) {
        this.editor.setValue(content);
    }
}
