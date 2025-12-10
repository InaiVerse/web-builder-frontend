const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.208.1:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

// Store active users and their data
const activeUsers = new Map();
const projectUsers = new Map(); // projectId -> Set of userIds

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle joining a project
    socket.on('join_project', (data) => {
        const { user_id, project_id } = data;
        
        // Join the project room
        socket.join(project_id);
        
        // Store user info
        activeUsers.set(socket.id, {
            id: user_id,
            socketId: socket.id,
            projectId: project_id,
            name: `User ${user_id.slice(0, 8)}`,
            joinedAt: new Date()
        });

        // Track project users
        if (!projectUsers.has(project_id)) {
            projectUsers.set(project_id, new Set());
        }
        projectUsers.get(project_id).add(user_id);

        // Notify others in the project
        socket.to(project_id).emit('user_joined', {
            user_id,
            name: `User ${user_id.slice(0, 8)}`,
            timestamp: new Date()
        });

        // Send current active users to the joining user
        const projectActiveUsers = Array.from(activeUsers.values())
            .filter(user => user.projectId === project_id)
            .map(user => ({
                id: user.id,
                name: user.name,
                joinedAt: user.joinedAt
            }));

        socket.emit('active_users', {
            users: projectActiveUsers,
            project_id
        });

        // Broadcast updated active users list
        socket.to(project_id).emit('active_users', {
            users: projectActiveUsers,
            project_id
        });

        console.log(`User ${user_id} joined project ${project_id}`);
    });

    // Handle file changes
    socket.on('file_change', (data) => {
        const { file_path, content, operation } = data;
        const user = activeUsers.get(socket.id);
        
        if (user) {
            const project_id = user.projectId;
            
            // Broadcast to other users in the same project
            socket.to(project_id).emit('file_changed', {
                file_path,
                content,
                operation,
                changed_by: user.id,
                timestamp: new Date()
            });

            console.log(`File change in ${project_id}: ${file_path} by ${user.id}`);
        }
    });

    // Handle cursor position
    socket.on('cursor_position', (data) => {
        const { file_path, line, column } = data;
        const user = activeUsers.get(socket.id);
        
        if (user) {
            const project_id = user.projectId;
            
            socket.to(project_id).emit('cursor_position', {
                file_path,
                line,
                column,
                user_id: user.id,
                timestamp: new Date()
            });
        }
    });

    // Handle text selection
    socket.on('text_selection', (data) => {
        const { file_path, start, end } = data;
        const user = activeUsers.get(socket.id);
        
        if (user) {
            const project_id = user.projectId;
            
            socket.to(project_id).emit('text_selection', {
                file_path,
                start,
                end,
                user_id: user.id,
                timestamp: new Date()
            });
        }
    });

    // Handle typing indicators
    socket.on('user_typing', (data) => {
        const { file_path, is_typing } = data;
        const user = activeUsers.get(socket.id);
        
        if (user) {
            const project_id = user.projectId;
            
            socket.to(project_id).emit('user_typing', {
                file_path,
                is_typing,
                user_id: user.id,
                timestamp: new Date()
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id);
        
        if (user) {
            const { id: user_id, projectId: project_id } = user;
            
            // Remove from active users
            activeUsers.delete(socket.id);
            
            // Remove from project users
            if (projectUsers.has(project_id)) {
                projectUsers.get(project_id).delete(user_id);
                if (projectUsers.get(project_id).size === 0) {
                    projectUsers.delete(project_id);
                }
            }
            
            // Notify others in the project
            socket.to(project_id).emit('user_left', {
                user_id,
                timestamp: new Date()
            });

            // Update active users list
            const projectActiveUsers = Array.from(activeUsers.values())
                .filter(user => user.projectId === project_id)
                .map(user => ({
                    id: user.id,
                    name: user.name,
                    joinedAt: user.joinedAt
                }));

            socket.to(project_id).emit('active_users', {
                users: projectActiveUsers,
                project_id
            });

            console.log(`User ${user_id} disconnected from project ${project_id}`);
        }
    });

    // Error handling
    socket.on('error', (error) => {
        console.error('Socket error:', error);
        socket.emit('error', { message: 'Socket error occurred' });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
    console.log(`CORS enabled for http://localhost:5173`);
});
