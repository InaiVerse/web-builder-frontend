import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

class SocketService {
  constructor() {
    this.socket = null;
    this.currentProjectId = null;
    this.currentUserId = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.onConnect?.();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
      this.onDisconnect?.();
    });

    // Project collaboration events
    this.socket.on('joined_project', (data) => {
      console.log('Joined project:', data);
      this.currentProjectId = data.project_id;
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

    // Real-time file events
    this.socket.on('file_changed', (data) => {
      console.log('File changed:', data);
      this.handleFileChange(data);
    });

    this.socket.on('cursor_position', (data) => {
      console.log('Cursor position:', data);
      this.handleCursorUpdate(data);
    });

    this.socket.on('user_typing', (data) => {
      console.log('User typing:', data);
      this.handleTypingIndicator(data);
    });

    this.socket.on('text_selection', (data) => {
      console.log('Text selection:', data);
      this.handleTextSelection(data);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.onError?.(data);
    });
  }

  // Project collaboration methods
  joinProject(userId, projectId) {
    this.currentUserId = userId;
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_project', {
        user_id: userId,
        project_id: projectId
      });
    }
  }

  leaveProject() {
    if (this.socket && this.currentProjectId) {
      this.socket.emit('leave_project', {});
      this.currentProjectId = null;
    }
  }

  // File operations
  sendFileChange(filePath, content, operation = 'update') {
    if (this.socket && this.socket.connected) {
      this.socket.emit('file_change', {
        file_path: filePath,
        content: content,
        operation: operation
      });
    }
  }

  sendCursorPosition(filePath, line, column) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('cursor_position', {
        file_path: filePath,
        line: line,
        column: column
      });
    }
  }

  sendTypingStatus(filePath, isTyping) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('user_typing', {
        file_path: filePath,
        is_typing: isTyping
      });
    }
  }

  sendTextSelection(filePath, start, end) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('text_selection', {
        file_path: filePath,
        start: start,
        end: end
      });
    }
  }

  // Event handlers (to be implemented in your UI)
  handleFileChange(data) {
    // Update file content in editor
    // data = { file_path, content, operation, changed_by, timestamp }
    this.onFileChanged?.(data);
  }

  handleCursorUpdate(data) {
    // Show other users' cursors in the editor
    // data = { file_path, line, column, user_id }
    this.onCursorPosition?.(data);
  }

  handleTypingIndicator(data) {
    // Show "User X is typing..." indicator
    // data = { file_path, is_typing, user_id }
    this.onUserTyping?.(data);
  }

  handleTextSelection(data) {
    // Show other users' text selections
    // data = { file_path, start, end, user_id }
    this.onTextSelection?.(data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      currentProjectId: this.currentProjectId,
      currentUserId: this.currentUserId
    };
  }

  // Event callbacks (to be set by the consuming component)
  onConnect = null;
  onDisconnect = null;
  onProjectJoined = null;
  onUserJoined = null;
  onUserLeft = null;
  onActiveUsersUpdated = null;
  onFileChanged = null;
  onCursorPosition = null;
  onUserTyping = null;
  onTextSelection = null;
  onError = null;
}

export default new SocketService();
