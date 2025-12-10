import React, { useState, useRef, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import CollaborativeCodeEditor from '../utils/collabCodeEditor';
import Chatbot from './Chatbot';
import Sidebar from './Sidebar';
import CollaborationPanel from '../components/CollaborationPanel';
import { File, Download, Users } from 'lucide-react';
import JSZip from 'jszip';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import socketService from '../../services/socketService';

const PROJECT_UPLOAD_URL = `${import.meta.env.VITE_API_URL}/auth/project/upload-folder`;

const looksLikeProjectId = (value) =>
    typeof value === 'string' && /^[0-9a-f-]{20,}$/i.test(value?.trim());

const sanitizeFolderName = (name = 'project') => {
    const trimmed = typeof name === 'string' ? name.trim() : 'project';
    return trimmed.replace(/[^\w.-]/g, '-').replace(/-+/g, '-');
};

const getFirstString = (candidates = []) =>
    candidates
        .map((candidate) =>
            typeof candidate === 'string' ? candidate.trim() : ''
        )
        .find((candidate) => candidate.length);

const slugify = (value = '') =>
    value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'generated-project';

const addPathsToStructure = (node, currentPath = '') => {
    if (!node) return null;
    const path = currentPath ? `${currentPath}/${node.name}` : node.name || '';
    const newNode = { ...node, path };

    if (Array.isArray(newNode.children)) {
        newNode.children = newNode.children
            .filter(Boolean)
            .map((child) => addPathsToStructure(child, path));
    }
    return newNode;
};

const normalizeProjectStructure = (rawStructure) => {
    if (!rawStructure) return null;

    const safeStructure = Array.isArray(rawStructure)
        ? {
            name: 'project',
            type: 'directory',
            children: rawStructure,
        }
        : rawStructure;

    const metadata = {
        code: getFirstString([
            safeStructure.code,
            safeStructure.project_code,
            safeStructure.projectCode,
            safeStructure.project_id,
            safeStructure.projectId,
            safeStructure.id,
            safeStructure.metadata?.project_id,
            safeStructure.project_details?.id,
        ]),
        name: getFirstString([
            safeStructure.project_name,
            safeStructure.projectName,
            safeStructure.folder_name,
            safeStructure.folderName,
            safeStructure.metadata?.project_name,
            safeStructure.slug,
            safeStructure.title,
            safeStructure.label,
            safeStructure.name,
        ]),
    };

    const singleChild =
        Array.isArray(safeStructure.children) &&
            safeStructure.children.length === 1
            ? safeStructure.children[0]
            : null;
    const shouldPromoteChild =
        singleChild &&
        singleChild.type !== 'file' &&
        looksLikeProjectId(safeStructure.name);

    const workingNode = shouldPromoteChild ? singleChild : safeStructure;
    const structureWithPaths = addPathsToStructure(workingNode);
    if (!structureWithPaths) return null;

    return {
        ...structureWithPaths,
        name: metadata.name || structureWithPaths.name || 'project',
        code:
            metadata.code ||
            safeStructure.code ||
            safeStructure.project_id ||
            safeStructure.name ||
            'project',
    };
};

const stripFirstPathSegment = (path = '') => {
    if (typeof path !== 'string') return '';
    const idx = path.indexOf('/');
    return idx === -1 ? path : path.slice(idx + 1);
};

const findFileByPath = (node, targetPath) => {
    if (!node || !targetPath) return null;
    if (node.type === 'file' && node.path === targetPath) {
        return node;
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            const found = findFileByPath(child, targetPath);
            if (found) return found;
        }
    }
    return null;
};

const findFileByName = (node, fileName) => {
    if (!node || !fileName) return null;
    const normalized = fileName.toLowerCase();
    if (node.type === 'file' && node.name?.toLowerCase() === normalized) {
        return node;
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            const found = findFileByName(child, normalized === fileName ? fileName : normalized);
            if (found) return found;
        }
    }
    return null;
};

const findFirstFile = (node) => {
    if (!node) return null;
    if (node.type === 'file') return node;
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            const found = findFirstFile(child);
            if (found) return found;
        }
    }
    return null;
};

const getSessionProjectName = () => {
    if (typeof window === 'undefined') return '';
    try {
        const stored = sessionStorage.getItem('projectData');
        if (!stored) return '';
        const parsed = JSON.parse(stored);
        return typeof parsed?.projectName === 'string' ? parsed.projectName.trim() : '';
    } catch (error) {
        console.warn('Failed to read projectData from sessionStorage:', error);
        return '';
    }
};

const getSessionProjectData = () => {
    if (typeof window === 'undefined') return {};
    try {
        const stored = sessionStorage.getItem('projectData');
        if (!stored) return {};
        const parsed = JSON.parse(stored);
        return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (error) {
        console.warn('Failed to parse projectData from sessionStorage:', error);
        return {};
    }
};

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
};

const getMimeType = (filename = '') => {
    const ext = (filename.split('.').pop() || '').toLowerCase();
    const map = {
        html: 'text/html',
        htm: 'text/html',
        css: 'text/css',
        js: 'application/javascript',
        json: 'application/json',
        txt: 'text/plain',
        md: 'text/markdown',
    };
    return map[ext] || 'text/plain';
};

const collectFilesFromStructure = (node) => {
    const files = [];
    if (!node) return files;

    const pushFile = (fileNode) => {
        if (!fileNode) return;
        const filePath = fileNode.path || fileNode.name;
        if (!filePath) return;
        files.push({
            name: filePath,
            content: fileNode.content || '',
        });
    };

    const traverse = (child) => {
        if (!child || !child.name) return;
        if (child.type === 'file') {
            pushFile(child);
            return;
        }
        if (Array.isArray(child.children)) {
            child.children.forEach(traverse);
        }
    };

    if (node.type === 'file') {
        pushFile(node);
        return files;
    }

    if (Array.isArray(node.children)) {
        node.children.forEach(traverse);
    }
    return files;
};

const updateStructureFileContent = (node, targetPath, newContent, fallbackName) => {
    if (!node) return node;

    const matchesTarget =
        (targetPath && node.path === targetPath) ||
        (!targetPath && fallbackName && node.name === fallbackName);

    if (node.type === 'file' && matchesTarget) {
        if (node.content === newContent) return node;
        return { ...node, content: newContent };
    }

    if (!Array.isArray(node.children)) return node;

    let didChange = false;
    const updatedChildren = node.children.map((child) => {
        const updatedChild = updateStructureFileContent(child, targetPath, newContent, fallbackName);
        if (updatedChild !== child) didChange = true;
        return updatedChild;
    });

    if (!didChange) return node;
    return { ...node, children: updatedChildren };
};

const getStoredToken = () => {
    if (typeof window === 'undefined') return '';
    return Cookies.get('access_token') || '';
};

const convertFilesToStructure = (files, rootName = 'project') => {
    if (!Array.isArray(files)) return null;

    const root = {
        name: rootName,
        type: 'directory',
        children: []
    };

    files.forEach(file => {
        // Handle paths like "folder/file.js" or just "file.js"
        const path = file.name || file.path;
        if (!path) return;

        const parts = path.split(/[/\\]/); // Split by / or \
        let currentLevel = root.children;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;

            if (isFile) {
                // Check if file already exists to avoid duplicates
                const existing = currentLevel.find(item => item.name === part && item.type === 'file');
                if (!existing) {
                    currentLevel.push({
                        name: part,
                        type: 'file',
                        content: file.content || ''
                    });
                }
            } else {
                let folder = currentLevel.find(item => item.name === part && item.type === 'directory');
                if (!folder) {
                    folder = {
                        name: part,
                        type: 'directory',
                        children: []
                    };
                    currentLevel.push(folder);
                }
                currentLevel = folder.children;
            }
        });
    });

    return root;
};

const uploadProjectFiles = async (files = [], { preferredName, preferredId } = {}) => {
    if (!PROJECT_UPLOAD_URL || !Array.isArray(files) || !files.length) return;

    // Get the integer project_id from Cookies (set when project was created)
    const cookieProjectId = Cookies.get('selected_project_id') || Cookies.get('project_id') || preferredId;
    const numericProjectId = cookieProjectId ? parseInt(cookieProjectId, 10) : NaN;

    console.log("Upload attempt:", {
        cookieProjectId,
        numericProjectId,
        preferredId,
        filesCount: files.length
    });

    // Backend requires an integer project_id - skip upload if we don't have one
    if (!numericProjectId || isNaN(numericProjectId)) {
        console.error('Skipping auto-upload: No valid project_id found.', {
            cookieProjectId,
            preferredId,
            numericProjectId
        });
        throw new Error('No valid project_id found for upload');
    }

    const sessionData = getSessionProjectData();
    const rawProjectName =
        sessionData.projectName ||
        sessionData.project_name ||
        preferredName ||
        'generated project';

    const sanitizedFolder =
        sanitizeFolderName(rawProjectName) ||
        slugify(rawProjectName) ||
        'generated-project';

    // Retrieve project type (default to 'project' if inside ProjectBuilder)
    const projectType = Cookies.get('selected_project_type') || 'project';

    const formData = new FormData();
    formData.append('project_name', rawProjectName);
    formData.append('project_id', numericProjectId.toString());
    formData.append('project_type', projectType);

    files.forEach((file) => {
        if (!file?.name) return;
        const blob = new Blob([file.content || ''], {
            type: getMimeType(file.name),
        });
        const normalizedPath = (() => {
            const original = String(file.name || '').replace(/^\/+/, '');
            if (original.trim().length) return original;
            return `${sanitizedFolder}/file`;
        })();
        formData.append('files', blob, normalizedPath);
    });

    const token = getStoredToken();
    const headers =
        token && token.trim().length
            ? {
                Authorization: token.toLowerCase().startsWith('bearer ')
                    ? token
                    : `Bearer ${token}`,
            }
            : undefined;

    console.log("Uploading to:", PROJECT_UPLOAD_URL, {
        project_name: rawProjectName,
        project_id: numericProjectId,
        project_type: projectType,
        filesCount: files.length
    });

    try {
        const response = await fetch(PROJECT_UPLOAD_URL, {
            method: 'POST',
            headers,
            body: formData,
        });

        console.log("Upload response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Upload failed response:", errorText);
            throw new Error(errorText || `Upload failed with status ${response.status}`);
        }

        const result = await response.json().catch(() => ({}));
        console.log("Upload success:", result);
        return result;
    } catch (error) {
        console.error('Auto upload failed:', error);
        throw error;
    }
};

const ProjectBuilder = ({ blueprint, onBack }) => {
    const [projectStructure, setProjectStructure] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [collaborationEnabled, setCollaborationEnabled] = useState(false);
    const [userActivity, setUserActivity] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [isLoadingProject, setIsLoadingProject] = useState(false);
    const lastUploadSignatureRef = useRef('');
    const isUploadingRef = useRef(false);
    const uploadTimeoutRef = useRef(null);

    React.useEffect(() => {
        return () => {
            if (uploadTimeoutRef.current) {
                clearTimeout(uploadTimeoutRef.current);
            }
        };
    }, []);

    // Socket.IO integration for real-time collaboration
    useEffect(() => {
        if (!collaborationEnabled) return;

        const token = getStoredToken();
        const userId = getUserId();
        const projectId = getProjectId();

        if (!token || !userId || !projectId) return;

        // Connect to socket server
        socketService.connect(token);

        // Setup socket event handlers
        socketService.onConnect = () => {
            console.log('Socket connected, joining project...');
            socketService.joinProject(userId, projectId);
        };

        socketService.onProjectJoined = (data) => {
            console.log('Successfully joined project:', data);
        };

        socketService.onUserJoined = (data) => {
            console.log('New user joined:', data);
            // Show notification or update UI
        };

        socketService.onUserLeft = (data) => {
            console.log('User left:', data);
            // Update active users list
        };

        socketService.onActiveUsersUpdated = (data) => {
            console.log('Active users updated:', data);
            setActiveUsers(data.users || []);
        };

        socketService.onFileChanged = (data) => {
            console.log('File changed by another user:', data);
            handleRemoteCodeChange(data.content, data.operation, data.changed_by);
        };

        socketService.onCursorPosition = (data) => {
            console.log('Remote cursor position:', data);
            handleUserActivity({ 
                type: 'cursor', 
                userId: data.user_id, 
                line: data.line, 
                column: data.column 
            });
        };

        socketService.onUserTyping = (data) => {
            console.log('User typing indicator:', data);
            handleUserActivity({ 
                type: 'typing', 
                userId: data.user_id, 
                isTyping: data.is_typing 
            });
        };

        socketService.onTextSelection = (data) => {
            console.log('Remote text selection:', data);
            handleUserActivity({ 
                type: 'selection', 
                userId: data.user_id, 
                start: data.start, 
                end: data.end 
            });
        };

        socketService.onError = (data) => {
            console.error('Socket error:', data);
        };

        socketService.onDisconnect = () => {
            console.log('Socket disconnected');
        };

        // Cleanup on unmount or when collaboration is disabled
        return () => {
            socketService.leaveProject();
            socketService.disconnect();
        };
    }, [collaborationEnabled, projectStructure?.code]);

    // Auto-load project if no blueprint provided but we have selected project in cookies
    // Auto-load project if no blueprint provided but we have selected project in cookies
    React.useEffect(() => {
        const loadExistingProject = async () => {
            if (blueprint) return;
            if (projectStructure) return;
            if (isLoadingProject) return; // Prevent duplicate calls

            const projectName = Cookies.get('selected_project_name');
            const projectId = Cookies.get('selected_project_id');
            const projectType = Cookies.get('selected_project_type') || 'project';

            if (!projectName) return;

            setIsLoadingProject(true);
            console.log("Loading existing project:", projectName, "type:", projectType);

            try {
                const token = getStoredToken();
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/fetch-folder`, {
                    method: "POST",
                    headers: {
                        ...headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        project_name: projectName,
                        project_id: projectId,
                        project_type: projectType
                    })
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log("Loaded project data:", data);

                if (data.status === true) {
                    let loadedStructure = null;

                    // 1. Check for Files (Highest Priority as they contain content)
                    let filesInput = data.files || data.data?.files || data.data;

                    // If filesInput is an object (key-value) and not an array, convert to array
                    if (filesInput && typeof filesInput === 'object' && !Array.isArray(filesInput)) {
                        console.log("Converting files object to array");
                        filesInput = Object.entries(filesInput).map(([name, content]) => ({
                            name,
                            content: typeof content === 'string' ? content : ''
                        }));
                    }

                    // Build structure from Files if available
                    if (Array.isArray(filesInput) && filesInput.length > 0) {
                        console.log(`Converting ${filesInput.length} files to array structure`);
                        loadedStructure = convertFilesToStructure(filesInput, projectName);
                    }

                    // 2. Fallback to existing structure/tree if no files found
                    if (!loadedStructure) {
                        loadedStructure = data.project_structure
                            || data.data?.project_structure
                            || data.structure
                            || data.tree; // Check for tree
                    }

                    if (loadedStructure) {
                        const normalized = normalizeProjectStructure(loadedStructure);
                        if (normalized) {
                            setProjectStructure(normalized);
                            // Auto select first file
                            const firstFile = findFirstFile(normalized);
                            if (firstFile) setActiveFile(firstFile);
                        }
                    } else {
                        console.warn("No structure or files found in response", data);
                    }
                } else {
                    console.error("Failed to load project:", data.message);
                    console.log("Request payload:", {
                        project_name: projectName,
                        project_id: projectId,
                        project_type: projectType
                    });
                    
                    // Try to load from session storage as fallback
                    const sessionData = getSessionProjectData();
                    console.log("Session data available:", sessionData);
                    
                    // Check if we have any blueprint data in sessionStorage or location.state
                    const locationState = window.location?.state;
                    const blueprintData = locationState?.blueprint || sessionData?.blueprint;
                    
                    // Also check for any shared project data in sessionStorage (for collaboration)
                    const sharedProjectKey = `project_${projectId}`;
                    const sharedProjectData = sessionStorage.getItem(sharedProjectKey);
                    
                    // Check all sessionStorage keys for debugging
                    console.log("All sessionStorage keys:", Object.keys(sessionStorage));
                    console.log("Looking for shared project key:", sharedProjectKey);
                    console.log("Shared project data found:", !!sharedProjectData);
                    
                    // First, check if the current sessionData has the actual project structure
                    if (sessionData && (sessionData.blueprint || sessionData.project_structure)) {
                        console.log("Using project structure from sessionData");
                        const structure = normalizeProjectStructure(sessionData.blueprint || sessionData.project_structure);
                        if (structure) {
                            setProjectStructure(structure);
                            const firstFile = findFirstFile(structure);
                            if (firstFile) setActiveFile(firstFile);
                            
                            // Save it to shared key for other users
                            sessionStorage.setItem(sharedProjectKey, JSON.stringify(structure));
                            console.log("Saved project structure to shared key for other users");
                            return;
                        }
                    }
                    
                    if (blueprintData) {
                        console.log("Using blueprint data as fallback:", blueprintData);
                        const structure = normalizeProjectStructure(blueprintData);
                        if (structure) {
                            setProjectStructure(structure);
                            const firstFile = findFirstFile(structure);
                            if (firstFile) setActiveFile(firstFile);
                            
                            // Save it to shared key for other users
                            sessionStorage.setItem(sharedProjectKey, JSON.stringify(structure));
                            return;
                        }
                    }
                    
                    if (sharedProjectData) {
                        console.log("Using shared project data as fallback:", sharedProjectData);
                        try {
                            const parsedData = JSON.parse(sharedProjectData);
                            const structure = normalizeProjectStructure(parsedData);
                            if (structure) {
                                setProjectStructure(structure);
                                const firstFile = findFirstFile(structure);
                                if (firstFile) setActiveFile(firstFile);
                                return;
                            }
                        } catch (e) {
                            console.warn("Failed to parse shared project data:", e);
                        }
                    }
                    
                    // Try to find any project data in sessionStorage by checking all keys
                    for (let i = 0; i < sessionStorage.length; i++) {
                        const key = sessionStorage.key(i);
                        if (key && key.includes('project') && key !== 'projectData') {
                            const data = sessionStorage.getItem(key);
                            console.log(`Found potential project data in key: ${key}`, data);
                            try {
                                const parsedData = JSON.parse(data);
                                if (parsedData.children || parsedData.files || parsedData.project_structure) {
                                    console.log(`Using project data from key: ${key}`);
                                    const structure = normalizeProjectStructure(parsedData);
                                    if (structure) {
                                        setProjectStructure(structure);
                                        const firstFile = findFirstFile(structure);
                                        if (firstFile) setActiveFile(firstFile);
                                        return;
                                    }
                                }
                            } catch (e) {
                                console.warn(`Failed to parse data from key ${key}:`, e);
                            }
                        }
                    }
                    
                    // If no project data found, check if we should create from blueprint or show error
                    console.error("No project data found for project:", projectName);
                    console.log("Available sessionStorage keys:", Object.keys(sessionStorage));
                    
                    // Check if there's a blueprint in the session data that we can use
                    if (sessionData && sessionData.blueprint) {
                        console.log("Using blueprint from session data");
                        const structure = normalizeProjectStructure(sessionData.blueprint);
                        if (structure) {
                            setProjectStructure(structure);
                            const firstFile = findFirstFile(structure);
                            if (firstFile) setActiveFile(firstFile);
                            
                            // Save to shared key for other users
                            sessionStorage.setItem(sharedProjectKey, JSON.stringify(structure));
                            return;
                        }
                    }
                    
                    // If no blueprint exists, show error instead of creating basic structure
                    console.error("No project structure available for:", projectName);
                    if (window.confirm(`No project structure found for "${projectName}". The project may not have been properly initialized. Would you like to go back and try again?`)) {
                        onBack();
                        return;
                    }
                    
                    // Don't create anything - let the user handle it
                    console.log("Waiting for project structure to be created...");
                }
            } catch (e) {
                console.error("Failed to load existing project", e);
                
                // Check if we got a response with data despite the error
                if (e.message.includes('500') && e.response) {
                    try {
                        const errorData = await e.response.json();
                        console.log("Error response data:", errorData);
                        
                        // If we got files data despite 500 error, try to use it
                        if (errorData.files || errorData.data?.files) {
                            console.log("Using files data from error response");
                            let filesInput = errorData.files || errorData.data?.files;
                            
                            if (filesInput && typeof filesInput === 'object' && !Array.isArray(filesInput)) {
                                filesInput = Object.entries(filesInput).map(([name, content]) => ({
                                    name,
                                    content: typeof content === 'string' ? content : ''
                                }));
                            }
                            
                            if (Array.isArray(filesInput) && filesInput.length > 0) {
                                const loadedStructure = convertFilesToStructure(filesInput, projectName);
                                if (loadedStructure) {
                                    const normalized = normalizeProjectStructure(loadedStructure);
                                    if (normalized) {
                                        setProjectStructure(normalized);
                                        const firstFile = findFirstFile(normalized);
                                        if (firstFile) setActiveFile(firstFile);
                                        return;
                                    }
                                }
                            }
                        }
                    } catch (parseError) {
                        console.warn("Failed to parse error response:", parseError);
                    }
                }
            } finally {
                setIsLoadingProject(false);
            }
        };

        loadExistingProject();
    }, [blueprint]);

    const scheduleAutoUpload = (structure, delay = 800) => {
        if (!structure) return;
        if (uploadTimeoutRef.current) {
            clearTimeout(uploadTimeoutRef.current);
        }
        uploadTimeoutRef.current = setTimeout(() => {
            uploadTimeoutRef.current = null;
            attemptAutoUpload(structure);
        }, Math.max(delay, 0));
    };

    const attemptAutoUpload = async (structure) => {
        if (!structure || !structure.children || !PROJECT_UPLOAD_URL) return;

        const files = collectFilesFromStructure(structure);
        if (!files.length) return;

        const signature = JSON.stringify(
            files.map((file) => `${file.name}:${file.content?.length || 0}`)
        );

        if (signature === lastUploadSignatureRef.current || isUploadingRef.current) {
            return;
        }

        lastUploadSignatureRef.current = signature;
        isUploadingRef.current = true;

        try {
            await uploadProjectFiles(files, {
                preferredName: structure.name,
                preferredId: structure.code,
            });
        } catch (error) {
            // already logged inside upload helper
        } finally {
            isUploadingRef.current = false;
        }
    };

    const handleProjectUpdate = (rawStructure) => {
        const structure = normalizeProjectStructure(rawStructure);
        if (!structure) return;
        const sessionData = getSessionProjectData();
        const preferredName =
            sessionData.projectName ||
            sessionData.project_name ||
            structure.name;
        const preferredCode =
            sessionData.projectCode ||
            sessionData.project_code ||
            structure.code;
        const enrichedStructure = {
            ...structure,
            name: typeof preferredName === 'string' ? preferredName.trim() : structure.name,
            code: typeof preferredCode === 'string' ? preferredCode.trim() : String(preferredCode || structure.code),
        };
        setProjectStructure(enrichedStructure);
        scheduleAutoUpload(enrichedStructure, 0); // Upload immediately
        
        // Save the complete structure to sessionStorage for other users
        try {
            const currentSessionData = getSessionProjectData();
            sessionStorage.setItem("projectData", JSON.stringify({
                ...currentSessionData,
                blueprint: enrichedStructure,
                lastUpdated: new Date().toISOString()
            }));
            
            // Also save to shared project key for collaboration
            const sharedProjectKey = `project_${enrichedStructure.code || enrichedStructure.name}`;
            sessionStorage.setItem(sharedProjectKey, JSON.stringify(enrichedStructure));
            
            console.log("Project structure saved to sessionStorage for collaboration");
            console.log("Shared project key:", sharedProjectKey);
        } catch (error) {
            console.warn("Failed to save project structure to sessionStorage:", error);
        }

        // Try to preserve the active file
        if (activeFile && activeFile.path) {
            const candidatePaths = [
                activeFile.path,
                stripFirstPathSegment(activeFile.path),
            ].filter(Boolean);

            let refreshedFile = null;

            for (const candidate of candidatePaths) {
                if (!candidate || candidate === activeFile.path && refreshedFile) continue;
                refreshedFile = findFileByPath(enrichedStructure, candidate);
                if (refreshedFile) break;
            }

            if (!refreshedFile) {
                refreshedFile = findFileByName(enrichedStructure, activeFile.name);
            }

            if (refreshedFile) {
                setActiveFile(refreshedFile);
                return;
            }
        }

        // Fallback: Automatically select the first file if available (recursive)
        const firstFile = findFirstFile(enrichedStructure);
        if (firstFile) setActiveFile(firstFile);
    };

    const handleFileSelect = (file) => {
        setActiveFile(file);
    };

    // Add real-time collaboration via sessionStorage polling
    useEffect(() => {
        if (!projectStructure?.code) return;
        
        const sharedProjectKey = `project_${projectStructure.code}`;
        
        // Check for changes from other users every 2 seconds
        const interval = setInterval(() => {
            try {
                const sharedData = sessionStorage.getItem(sharedProjectKey);
                if (sharedData) {
                    const parsedData = JSON.parse(sharedData);
                    
                    // Only update if the data is different and newer
                    if (JSON.stringify(parsedData) !== JSON.stringify(projectStructure)) {
                        console.log("Detected changes from other user, updating project structure");
                        const structure = normalizeProjectStructure(parsedData);
                        if (structure) {
                            setProjectStructure(structure);
                            
                            // Update active file if it exists
                            if (activeFile) {
                                const updatedFile = findFileByPath(structure, activeFile.path);
                                if (updatedFile && updatedFile.content !== activeFile.content) {
                                    setActiveFile(updatedFile);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn("Failed to check for shared project updates:", error);
            }
        }, 2000);
        
        return () => clearInterval(interval);
    }, [projectStructure?.code, projectStructure, activeFile]);

    const handleCodeChange = (value) => {
        if (!activeFile) return;
        
        const updatedFile = { ...activeFile, content: value };
        setActiveFile(updatedFile);
        
        // Update project structure with new file content
        const updatedStructure = updateStructureFileContent(projectStructure, activeFile.path, value, activeFile.name);
        setProjectStructure(updatedStructure);
        
        // Send changes through Socket.IO if collaboration is enabled
        if (collaborationEnabled) {
            socketService.sendFileChange(activeFile.path, value, 'update');
        }
        
        // Save to shared project key for real-time collaboration (fallback)
        try {
            const sharedProjectKey = `project_${updatedStructure.code || updatedStructure.name}`;
            sessionStorage.setItem(sharedProjectKey, JSON.stringify(updatedStructure));
            console.log("Updated shared project data for collaboration");
        } catch (error) {
            console.warn("Failed to save updated project structure:", error);
        }
        
        // Auto-upload to backend to persist changes for all users
        scheduleAutoUpload(updatedStructure, 2000);
    };

    const handleRemoteCodeChange = (content, operation, changedBy) => {
        // Handle remote changes from collaboration
        if (!activeFile) return;
        
        console.log(`Remote change by ${changedBy}:`, { operation, contentLength: content?.length });
        
        // Update the file content in the structure
        setProjectStructure((prevStructure) => {
            if (!prevStructure) return prevStructure;
            return updateStructureFileContent(
                prevStructure,
                activeFile.path,
                content,
                activeFile.name
            );
        });

        // Update active file content
        setActiveFile(prev => prev ? { ...prev, content } : prev);
    };

    const handleUserActivity = (activity) => {
        setUserActivity(prev => ({
            ...prev,
            [activity.type]: activity
        }));
        
        // Update active users if provided
        if (activity.type === 'users_updated' && activity.users) {
            setActiveUsers(activity.users);
        }
    };

    const getUserId = () => {
        // Get or generate a user ID for collaboration
        let userId = Cookies.get('collaboration_user_id');
        if (!userId) {
            userId = uuidv4();
            Cookies.set('collaboration_user_id', userId, { expires: 365 });
        }
        return userId;
    };

    const getProjectId = () => {
        // Get project ID for collaboration
        return Cookies.get('selected_project_id') || projectStructure?.code || 'default-project';
    };

    const handleDownloadProject = async () => {
        if (!projectStructure) return;

        try {
            await attemptAutoUpload(projectStructure);
        } catch {
            // upload errors already logged inside helper
        }

        const zip = new JSZip();
        const rootFolderName = sanitizeFolderName(projectStructure.name || 'project');
        const rootFolder = zip.folder(rootFolderName);

        const addToZip = (node, parentFolder) => {
            if (!node || !parentFolder) return;

            node.children?.forEach(child => {
                if (!child) return;
                if (child.type === 'file') {
                    parentFolder.file(child.name, child.content || '');
                } else {
                    const nextFolder = parentFolder.folder(child.name);
                    addToZip(child, nextFolder);
                }
            });
        };

        addToZip(projectStructure, rootFolder);

        const content = await zip.generateAsync({ type: 'blob' });
        downloadBlob(content, `${rootFolderName}.zip`);
    };

    const fallbackProjectName = getSessionProjectName();
    const shouldUseFallbackName =
        fallbackProjectName &&
        projectStructure?.name &&
        looksLikeProjectId(projectStructure.name);
    const sidebarProjectLabel =
        (shouldUseFallbackName && fallbackProjectName) ||
        projectStructure?.name ||
        fallbackProjectName ||
        'Project';
    const sidebarStructure =
        shouldUseFallbackName && projectStructure
            ? { ...projectStructure, name: sidebarProjectLabel }
            : projectStructure;

    return (
        <div className="flex h-screen w-screen flex-col bg-[#f4f6fb] text-slate-900">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Project Builder</p>
                    <div className="flex flex-wrap items-center gap-3">

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-medium text-slate-600">
                            Code&nbsp;:&nbsp;{projectStructure?.code || Cookies.get('selected_project_id') || '15CGHTYU44'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        onClick={onBack}
                    >
                        ← Back
                    </button>
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                        Share Preview
                    </button>
                    <button
                        onClick={() => setCollaborationEnabled(!collaborationEnabled)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            collaborationEnabled 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Users size={16} className="inline mr-2" />
                        {collaborationEnabled ? 'Collaboration On' : 'Collaboration Off'}
                    </button>
                    <button
                        onClick={handleDownloadProject}
                        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-black"
                    >
                        Publish Project
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden px-4 pb-4 pt-3 gap-4">
                {/* Left Side: File Explorer */}
                <div className="w-64 min-w-[240px] flex-shrink-0 rounded-3xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.05)]">
                    <Sidebar
                        projectStructure={sidebarStructure}
                        projectLabel={sidebarProjectLabel}
                        onFileSelect={handleFileSelect}
                    />
                </div>

                {/* Middle: Code Editor */}
                <div className="flex flex-1 flex-col min-w-0 rounded-3xl border border-slate-200 bg-[#fefefe] shadow-[0_20px_45px_rgba(15,23,42,0.07)] overflow-hidden">
                    {activeFile ? (
                        <>
                            {/* Editor Tabs & Actions */}
                            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                    <File size={14} className="text-blue-500" />
                                    <span>{activeFile.name}</span>
                                </div>

                                <button
                                    onClick={handleDownloadProject}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    <Download size={16} />
                                    Download .zip
                                </button>
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 relative bg-[#f9fbff]">
                                {collaborationEnabled ? (
                                    <div className="relative w-full h-full">
                                        {/* Socket connection status indicator */}
                                        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                socketService.getConnectionStatus().isConnected 
                                                    ? 'bg-green-500' 
                                                    : 'bg-red-500'
                                            }`} />
                                            <span className="text-xs text-gray-500">
                                                {socketService.getConnectionStatus().isConnected 
                                                    ? 'Connected' 
                                                    : 'Disconnected'
                                                }
                                            </span>
                                        </div>

                                        {/* Active users indicator */}
                                        {activeUsers.length > 0 && (
                                            <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                                                <Users size={14} className="text-blue-500" />
                                                <span className="text-xs text-gray-500">
                                                    {activeUsers.length} active
                                                </span>
                                            </div>
                                        )}

                                        <CollaborativeCodeEditor
                                            code={activeFile.content}
                                            language={activeFile.name.endsWith('.py') ? 'python' : 'javascript'}
                                            onChange={handleCodeChange}
                                            theme="vs-light"
                                            projectId={getProjectId()}
                                            filePath={activeFile.path}
                                            userId={getUserId()}
                                            onRemoteChange={handleRemoteCodeChange}
                                            onUserActivity={handleUserActivity}
                                            filename={activeFile.name}
                                        />
                                    </div>
                                ) : (
                                    <CodeEditor
                                        code={activeFile.content}
                                        language={activeFile.name.endsWith('.py') ? 'python' : 'javascript'}
                                        onChange={handleCodeChange}
                                        theme="vs-light"
                                        filename={activeFile.name}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-slate-400">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                                <File size={28} strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-medium">Select a file to view code</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Chatbot/Preview */}
                <div className="w-[360px] min-w-[320px] max-w-[40%] flex-shrink-0 rounded-3xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
                    <Chatbot onProjectUpdate={handleProjectUpdate} blueprint={blueprint} />
                    {collaborationEnabled && (
                        <CollaborationPanel 
                            userActivity={userActivity} 
                            activeUsers={activeUsers}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectBuilder;
