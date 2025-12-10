'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/Web-Builder/Components/ui/button';
import { Input } from '@/Web-Builder/Components/ui/input';
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  X,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  Settings
} from 'lucide-react';
import { ProjectManager } from '@/Web-Builder/lib/project-manager';
import Editor from '@monaco-editor/react';

export function CodeEditor({ className, highlightRange, onHighlightClear }) {
  const [project, setProject] = useState(() => ProjectManager.getInstance().getProject());
  const [editingFileId, setEditingFileId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

  useEffect(() => {
    const unsubscribe = ProjectManager.getInstance().subscribe(setProject);
    return unsubscribe;
  }, []);

  // Handle line highlighting when highlightRange changes
  useEffect(() => {
    if (highlightRange && editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;

      const startLine = highlightRange.start_line || 1;
      const endLine = highlightRange.end_line || startLine;

      console.log('📍 Highlighting lines:', startLine, 'to', endLine);

      // Scroll to the highlighted line
      editor.revealLineInCenter(startLine);

      // Create decoration for highlighting
      const newDecorations = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(startLine, 1, endLine, 1),
          options: {
            isWholeLine: true,
            className: 'highlighted-line',
            glyphMarginClassName: 'highlighted-glyph',
            linesDecorationsClassName: 'highlighted-line-decoration'
          }
        }
      ]);

      decorationsRef.current = newDecorations;

      // Also set cursor position
      editor.setPosition({ lineNumber: startLine, column: 1 });
      editor.focus();

      // Auto-clear highlight after 5 seconds
      const timer = setTimeout(() => {
        if (editorRef.current && decorationsRef.current.length > 0) {
          editorRef.current.deltaDecorations(decorationsRef.current, []);
          decorationsRef.current = [];
          if (onHighlightClear) onHighlightClear();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [highlightRange, onHighlightClear]);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add custom CSS for line highlighting
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .highlighted-line {
        background-color: rgba(16, 185, 129, 0.2) !important;
        border-left: 3px solid #10b981 !important;
      }
      .highlighted-glyph {
        background-color: #10b981;
      }
      .highlighted-line-decoration {
        background-color: #10b981;
        width: 3px !important;
        margin-left: 3px;
      }
    `;
    document.head.appendChild(styleEl);

    console.log('📝 Monaco editor mounted');
  }, []);

  const handleCreateFile = useCallback((parentId) => {
    if (!newFileName.trim()) return;

    try {
      ProjectManager.getInstance().createFile(parentId, newFileName, '', 'text');
      setNewFileName('');
      setEditingFileId(null);
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  }, [newFileName]);

  const handleCreateFolder = useCallback((parentId) => {
    if (!newFolderName.trim()) return;

    try {
      ProjectManager.getInstance().createFolder(parentId, newFolderName);
      setNewFolderName('');
      setEditingFolderId(null);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  }, [newFolderName]);

  const handleDeleteFile = useCallback((fileId) => {
    try {
      ProjectManager.getInstance().deleteFile(fileId);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }, []);

  const _handleRenameFile = useCallback((fileId, newName) => {
    try {
      ProjectManager.getInstance().renameFile(fileId, newName);
    } catch (error) {
      console.error('Failed to rename file:', error);
    }
  }, []);

  const handleSelectFile = useCallback((fileId) => {
    try {
      const projectManager = ProjectManager.getInstance();
      const file = projectManager.findNodePublic(fileId);

      if (file) {
        // Debug logs
        console.log('Selected file:', file);

        // Get files from ProjectManager instance
        const projectFiles = projectManager.files || {};
        console.log('Available files in ProjectManager:', Object.keys(projectFiles));

        // If the file has no content, try to get it from projectFiles
        if (!file.content || file.content === '') {
          // Try different path formats to find the file
          const possiblePaths = [
            file.path,
            file.path.startsWith('/') ? file.path.substring(1) : `/${file.path}`,
            `./${file.path}`,
            file.path.replace(/^\//, ''),
            file.name,
            `/${file.name}`,
            `./${file.name}`
          ];

          for (const path of possiblePaths) {
            if (projectFiles[path]) {
              console.log(`Found content for path: ${path}`);
              file.content = projectFiles[path];
              projectManager.updateFile(fileId, file.content);
              break;
            }
          }
        }

        if (file.content) {
          console.log('File content:', file.content.substring(0, 100) + '...');
        } else {
          console.warn('No content found for file:', file);
          console.warn('Tried paths:', [
            file.path,
            file.path.startsWith('/') ? file.path.substring(1) : `/${file.path}`,
            `./${file.path}`,
            file.path.replace(/^\//, ''),
            file.name,
            `/${file.name}`,
            `./${file.name}`
          ]);
        }

        projectManager.setActiveFile(fileId);
      }
    } catch (error) {
      console.error('Failed to select file:', error);
    }
  }, []);

  const handleCloseFile = useCallback((fileId) => {
    try {
      ProjectManager.getInstance().closeFile(fileId);
    } catch (error) {
      console.error('Failed to close file:', error);
    }
  }, []);

  const handleToggleFolder = useCallback((folderId) => {
    try {
      ProjectManager.getInstance().toggleFolder(folderId);
    } catch (error) {
      console.error('Failed to toggle folder:', error);
    }
  }, []);

  const getFileIcon = (node) => {
    if (node.type === 'folder') {
      return node.isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />;
    }

    const iconMap = {
      'html': <FileText className="h-4 w-4 text-orange-500" />,
      'css': <FileText className="h-4 w-4 text-blue-500" />,
      'javascript': <FileText className="h-4 w-4 text-yellow-500" />,
      'typescript': <FileText className="h-4 w-4 text-blue-600" />,
      'jsx': <FileText className="h-4 w-4 text-cyan-500" />,
      'tsx': <FileText className="h-4 w-4 text-cyan-600" />,
      'json': <FileText className="h-4 w-4 text-gray-500" />
    };

    return iconMap[node.language || ''] || <File className="h-4 w-4 text-gray-400" />;
  };

  const renderFileTree = (nodes, depth = 0) => {
    return nodes.map(node => {
      const isActive = project.activeFileId === node.id;
      const isOpen = project.openFiles.includes(node.id);

      if (node.type === 'folder') {
        return (
          <div key={node.id}>
            <div
              className={`flex items-center gap-1 px-2 py-1 hover:bg-gray-800 cursor-pointer rounded ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'
                }`}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              onClick={() => handleToggleFolder(node.id)}
            >
              {node.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {getFileIcon(node)}
              <span className="text-sm text-gray-300">{node.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0 opacity-0 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingFolderId(node.id);
                  setNewFolderName('');
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {editingFolderId === node.id && (
              <div
                className="flex items-center gap-1 px-2 py-1"
                style={{ paddingLeft: `${depth * 12 + 20}px` }}
              >
                <Folder className="h-4 w-4 text-gray-400" />
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder(node.id);
                    } else if (e.key === 'Escape') {
                      setEditingFolderId(null);
                      setNewFolderName('');
                    }
                  }}
                  placeholder="Folder name"
                  className="h-6 text-xs"
                  autoFocus
                />
              </div>
            )}

            {node.isExpanded && node.children && renderFileTree(node.children, depth + 1)}
          </div>
        );
      }

      return (
        <div key={node.id}>
          <div
            className={`flex items-center gap-1 px-2 py-1 hover:bg-gray-800 cursor-pointer rounded ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'
              }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => handleSelectFile(node.id)}
          >
            {getFileIcon(node)}
            <span className="text-sm flex-1">{node.name}</span>
            {isActive && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFile(node.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(node.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    });
  };

  const projectManager = ProjectManager.getInstance();
  const activeFile = project.activeFileId ? projectManager.findNodePublic(project.activeFileId) : null;
  let activeContent = activeFile?.content || '';

  // If content is empty, try to get it from projectManager.files
  if (activeFile && !activeContent) {
    const projectFiles = projectManager.files || {};

    // Try different path formats to find the file
    const possiblePaths = [
      activeFile.path,
      activeFile.path.startsWith('/') ? activeFile.path.substring(1) : `/${activeFile.path}`,
      `./${activeFile.path}`,
      activeFile.path.replace(/^\//, ''),
      activeFile.name,
      `/${activeFile.name}`,
      `./${activeFile.name}`
    ];

    for (const path of possiblePaths) {
      if (projectFiles[path]) {
        activeContent = projectFiles[path];
        // Update the file content in the project manager
        activeFile.content = activeContent;
        projectManager.updateFile(activeFile.id, activeContent);
        console.log(`Found content for ${activeFile.name} using path: ${path}`);
        break;
      }
    }

    if (!activeContent) {
      console.warn('No content found for file:', activeFile);
      console.warn('Tried paths:', possiblePaths);
      console.log('Available files:', Object.keys(projectFiles));
    }
  }


  return (
    <div className={`flex h-full bg-gray-950 ${className}`}>
      {/* File Explorer */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Explorer</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setEditingFileId('root')}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-7 h-7 text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {editingFileId === 'root' && (
            <div className="flex items-center gap-1 px-2 py-1">
              <File className="h-4 w-4 text-gray-400" />
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFile('root');
                  } else if (e.key === 'Escape') {
                    setEditingFileId(null);
                    setNewFileName('');
                  }
                }}
                placeholder="File name"
                className="h-6 text-xs"
                autoFocus
              />
            </div>
          )}

          {project.root.children && renderFileTree(project.root.children)}
        </div>

        {/* Open Files Tabs */}
        <div className="border-t border-gray-800">
          <div className="px-3 py-2">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Open Files</h4>
            <div className="flex flex-wrap gap-1">
              {project.openFiles.map(fileId => {
                const file = ProjectManager.getInstance().findNodePublic(fileId);
                if (!file) return null;

                const isActive = project.activeFileId === fileId;
                return (
                  <Button
                    key={fileId}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`h-6 px-2 text-xs ${isActive ? 'bg-gray-800' : 'text-gray-400'}`}
                    onClick={() => handleSelectFile(fileId)}
                  >
                    {file.name}
                    <X
                      className="h-3 w-3 ml-1 opacity-0 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseFile(fileId);
                      }}
                    />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 flex flex-col">
        {activeFile ? (
          <>
            <div className="border-b border-gray-800 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getFileIcon(activeFile)}
                  <span className="text-sm font-medium text-gray-300">{activeFile.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {activeFile.language}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage={activeFile.language || 'plaintext'}
                language={activeFile.language || 'plaintext'}
                value={activeContent}
                onChange={(value) => {
                  try {
                    ProjectManager.getInstance().updateFile(activeFile.id, value || '');
                  } catch (error) {
                    console.error('Failed to update file:', error);
                  }
                }}
                onMount={handleEditorDidMount}
                className="w-full h-full p-4 bg-gray-950 text-gray-300 font-mono text-sm resize-none focus:outline-none"
                placeholder="Start typing..."
                spellCheck={false}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  glyphMargin: true,
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No file selected</p>
              <p className="text-xs mt-2">Select a file from the explorer or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
