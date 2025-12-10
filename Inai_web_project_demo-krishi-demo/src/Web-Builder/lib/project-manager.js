import { initialPages } from '@/Web-Builder/lib/initial-content';

export class ProjectManager {
  static instance = null;

  constructor() {
    if (ProjectManager.instance) {
      return ProjectManager.instance;
    }

    this.project = this.initializeProject();
    this.listeners = [];

    ProjectManager.instance = this;
  }

  static getInstance() {
    if (!ProjectManager.instance) {
      ProjectManager.instance = new ProjectManager();
    }    
    return ProjectManager.instance;
  }

  initializeProject() {
    const root = {
      id: 'root',
      name: 'project',
      type: 'folder',
      path: '/',
      isExpanded: true,
      children: [
        {
          id: 'html',
          name: 'index.html',
          type: 'file',
          path: '/index.html',
          content: initialPages[0]?.body || '',
          language: 'html'
        },
        {
          id: 'css',
          name: 'styles.css',
          type: 'file',
          path: '/styles.css',
          content: '/* CSS styles */',
          language: 'css'
        },
        {
          id: 'js',
          name: 'script.js',
          type: 'file',
          path: '/script.js',
          content: '// JavaScript code',
          language: 'javascript'
        }
      ]
    };

    return {
      root,
      activeFileId: 'html',
      openFiles: ['html']
    };
  }

  getProject() {
    return { ...this.project };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.getProject()));
  }

  createFile(parentId, name, content = '', language = 'text') {
    const parent = this.findNode(parentId);
    if (!parent || parent.type !== 'folder') {
      throw new Error('Parent folder not found');
    }

    const fileId = this.generateId();
    const path = `${parent.path === '/' ? '' : parent.path}/${name}`;

    const newFile = {
      id: fileId,
      name,
      type: 'file',
      path,
      content,
      language
    };

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(newFile);

    this.notify();
    return newFile;
  }

  createFolder(parentId, name) {
    const parent = this.findNode(parentId);
    if (!parent || parent.type !== 'folder') {
      throw new Error('Parent folder not found');
    }

    const folderId = this.generateId();
    const path = `${parent.path === '/' ? '' : parent.path}/${name}`;

    const newFolder = {
      id: folderId,
      name,
      type: 'folder',
      path,
      isExpanded: false,
      children: []
    };

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(newFolder);

    this.notify();
    return newFolder;
  }

  deleteFile(fileId) {
    const node = this.findNode(fileId);
    if (!node) {
      throw new Error('File not found');
    }

    const parent = this.findParent(fileId);
    if (parent && parent.children) {
      parent.children = parent.children.filter(child => child.id !== fileId);

      // Remove from open files and active file
      this.project.openFiles = this.project.openFiles.filter(id => id !== fileId);
      if (this.project.activeFileId === fileId) {
        this.project.activeFileId = this.project.openFiles[0] || null;
      }

      this.notify();
    }
  }

  deleteFolder(folderId) {
    const node = this.findNode(folderId);
    if (!node || node.type !== 'folder') {
      throw new Error('Folder not found');
    }

    const parent = this.findParent(folderId);
    if (!parent || !parent.children) {
      throw new Error('Parent folder not found');
    }

    // Remove folder from parent
    parent.children = parent.children.filter(child => child.id !== folderId);

    // Remove any open files that were in this folder
    const removeOpenFilesInFolder = (folderNode) => {
      if (folderNode.type === 'file') {
        this.project.openFiles = this.project.openFiles.filter(id => id !== folderNode.id);
        if (this.project.activeFileId === folderNode.id) {
          this.project.activeFileId = this.project.openFiles[0] || null;
        }
      } else if (folderNode.children) {
        folderNode.children.forEach(removeOpenFilesInFolder);
      }
    };

    removeOpenFilesInFolder(node);
    this.notify();
  }

  loadFromServer(treeData) {
    if (!treeData) {
      console.warn('loadFromServer called without data');
      return;
    }

    const root = {
      id: 'root',
      name: 'project',
      type: 'folder',
      path: '/',
      isExpanded: true,
      children: []
    };

    const resolveName = (entry) =>
      entry?.name || entry?.file_name || entry?.filename || entry?.folder_name || entry?.path?.split('/')?.pop() || 'untitled';

    const resolveType = (entry) => {
      const declared = (entry?.type || entry?.entry_type || entry?.kind || '').toLowerCase();
      if (declared === 'folder' || declared === 'directory') return 'folder';
      if (declared === 'file') return 'file';
      return Array.isArray(entry?.children) || Array.isArray(entry?.folders)
        ? 'folder'
        : 'file';
    };

    const resolveContent = (entry) => {
      if (!entry) return '';

      const directContent =
        entry?.content ??
        entry?.file_content ??
        entry?.fileContent ??
        entry?.file_data ??
        entry?.fileData ??
        entry?.body ??
        entry?.html ??
        entry?.text ??
        entry?.raw ??
        entry?.raw_content ??
        entry?.rawContent ??
        entry?.data ??
        entry?.value;

      if (typeof directContent === 'string') {
        return directContent;
      }

      if (entry?.file && typeof entry.file?.content === 'string') {
        return entry.file.content;
      }

      if (entry?.payload && typeof entry.payload?.content === 'string') {
        return entry.payload.content;
      }

      if (Array.isArray(entry?.lines)) {
        return entry.lines.join('\n');
      }

      if (Array.isArray(entry?.chunks)) {
        return entry.chunks.map((chunk) => (typeof chunk === 'string' ? chunk : '')).join('');
      }

      if (entry?.fileBlob && typeof entry.fileBlob?.content === 'string') {
        return entry.fileBlob.content;
      }

      return '';
    };

    const collectChildren = (entry) => {
      const buckets = [];
      if (Array.isArray(entry?.children)) buckets.push(...entry.children);
      if (Array.isArray(entry?.folders)) buckets.push(...entry.folders.map((folder) => ({ ...folder, type: folder.type || 'folder' })));
      if (Array.isArray(entry?.files)) buckets.push(...entry.files.map((file) => ({ ...file, type: file.type || 'file' })));
      if (Array.isArray(entry?.items)) buckets.push(...entry.items);
      return buckets;
    };

    const buildNodes = (entries, parent) => {
      if (!Array.isArray(entries)) return;
      entries.forEach((entry) => {
        if (!entry) return;
        const name = resolveName(entry);
        if (!name) return;

        const nodeType = resolveType(entry);
        const nodeId = this.generateId();
        const path = `${parent.path === '/' ? '' : parent.path}/${name}`;

        if (nodeType === 'folder') {
          const folderNode = {
            id: nodeId,
            name,
            type: 'folder',
            path,
            isExpanded: true,
            children: []
          };
          parent.children.push(folderNode);
          const childEntries = collectChildren(entry);
          buildNodes(childEntries, folderNode);
        } else {
          const fileContent = resolveContent(entry);
          const fileNode = {
            id: nodeId,
            name,
            type: 'file',
            path,
            content: fileContent,
            language: this.getLanguageFromExtension(name)
          };
          parent.children.push(fileNode);
        }
      });
    };

    const normalizedEntries = Array.isArray(treeData)
      ? treeData
      : Array.isArray(treeData?.children)
        ? treeData.children
        : Array.isArray(treeData?.data)
          ? treeData.data
          : [];

    buildNodes(normalizedEntries, root);

    const findFirstFile = (node, predicate = () => true) => {
      if (node.type === 'file' && predicate(node)) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findFirstFile(child, predicate);
          if (found) return found;
        }
      }
      return null;
    };

    const firstHtml = findFirstFile(root, (node) => node.language === 'html');
    const firstAny = firstHtml || findFirstFile(root);

    this.project = {
      root,
      activeFileId: firstAny?.id || null,
      openFiles: firstAny ? [firstAny.id] : []
    };

    this.notify();
  }

  updateFile(fileId, content) {
    const node = this.findNode(fileId);
    if (!node || node.type !== 'file') {
      throw new Error('File not found or not a file');
    }

    node.content = content;
    this.notify();
  }

  renameFile(fileId, newName) {
    const node = this.findNode(fileId);
    if (!node) {
      throw new Error('File not found');
    }

    node.name = newName;

    // Update path
    const parent = this.findParent(fileId);
    if (parent) {
      const parentPath = parent.path === '/' ? '' : parent.path;
      node.path = `${parentPath}/${newName}`;
    }

    this.notify();
  }

  setActiveFile(fileId) {
    const node = this.findNode(fileId);
    if (!node || node.type !== 'file') {
      throw new Error('File not found or not a file');
    }

    this.project.activeFileId = fileId;

    // Add to open files if not already there
    if (!this.project.openFiles.includes(fileId)) {
      this.project.openFiles.push(fileId);
    }

    this.notify();
  }

  closeFile(fileId) {
    this.project.openFiles = this.project.openFiles.filter(id => id !== fileId);

    // If closing the active file, switch to another open file
    if (this.project.activeFileId === fileId) {
      this.project.activeFileId = this.project.openFiles[0] || null;
    }

    this.notify();
  }

  toggleFolder(folderId) {
    const node = this.findNode(folderId);
    if (!node || node.type !== 'folder') {
      throw new Error('Folder not found');
    }

    node.isExpanded = !node.isExpanded;
    this.notify();
  }

  getFileContent(fileId) {
    const node = this.findNode(fileId);
    if (!node || node.type !== 'file') {
      throw new Error('File not found or not a file');
    }
    return node.content || '';
  }

  findFileByName(name) {
    if (!name) return null;
    const target = String(name).toLowerCase();

    const search = (node) => {
      if (node.type === 'file' && node.name?.toLowerCase() === target) {
        return node;
      }

      if (node.children) {
        for (const child of node.children) {
          const found = search(child);
          if (found) return found;
        }
      }
      return null;
    };

    return search(this.project.root);
  }

  findNode(id) {
    return this.searchNode(this.project.root, id);
  }

  // Public method to find node for external Components
  findNodePublic(id) {
    return this.searchNode(this.project.root, id);
  }

  getFileByPath(path) {
    const searchByPath = (node) => {
      if (node.type === 'file' && node.path === path) {
        return node;
      }
      if (node.children) {
        for (const child of node.children) {
          const found = searchByPath(child);
          if (found) return found;
        }
      }
      return null;
    };
    return searchByPath(this.project.root);
  }

  findParent(id) {
    return this.searchParent(this.project.root, id);
  }

  searchNode(node, id) {
    if (node.id === id) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = this.searchNode(child, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  searchParent(node, id, parent = null) {
    if (node.id === id) {
      return parent;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = this.searchParent(child, id, node);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  generateId() {
    return Math.random().toString(36).slice(2, 11);
  }

  // Import/Export functionality for AI responses
  importProjectStructure(files) {
    // Validate input
    if (!Array.isArray(files)) {
      console.error('Invalid files array provided to importProjectStructure');
      return;
    }

    const newRoot = {
      id: 'root',
      name: 'project',
      type: 'folder',
      path: '/',
      children: []
    };

    const folders = {
      '/': newRoot
    };

    files.forEach(file => {
      // Validate file object
      if (!file || !file.name) {
        console.error('Invalid file object:', file);
        return;
      }

      const parts = file.name.split('/');
      const fileName = parts.pop() || 'untitled';
      const folderPath = parts.join('/');

      // Create folder structure
      if (folderPath && !folders[folderPath]) {
        parts.forEach((part, index) => {
          const path = parts.slice(0, index + 1).join('/');
          if (!folders[path]) {
            const parentId = index === 0 ? 'root' : folders[parts.slice(0, index).join('/')].id;
            const folder = this.createFolder(parentId, part);
            folders[path] = folder;
          }
        });
      }

      // Create file
      const parentId = folderPath ? folders[folderPath].id : 'root';
      const language = this.getLanguageFromExtension(fileName);
      this.createFile(parentId, fileName, file.content, language);
    });

    this.notify();
  }

  exportProjectStructure() {
    const files = [];

    const traverse = (node) => {
      if (node.type === 'file' && node.content) {
        files.push({
          name: node.path.substring(1), // Remove leading slash
          content: node.content,
          type: node.language || 'text'
        });
      } else if (node.type === 'folder' && node.children) {
        node.children.forEach(child => traverse(child));
      }
    };

    this.project.root.children?.forEach(child => traverse(child));
    return files;
  }

  getLanguageFromExtension(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap = {
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'php': 'php',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'sql': 'sql',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash'
    };

    return languageMap[ext || ''] || 'text';
  }
}
