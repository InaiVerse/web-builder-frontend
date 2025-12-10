# INAI Web Builder & Project Builder

A comprehensive web-based development platform featuring AI-powered code generation, real-time collaboration, and visual project building capabilities.

## 🚀 Features

### Web Builder
- **AI-Powered Code Generation**: Generate HTML, CSS, and JavaScript code using natural language
- **Live Preview**: Real-time preview of generated code with responsive design support
- **Code Editor**: Advanced Monaco-based code editor with syntax highlighting
- **Multi-file Support**: Handle complex projects with multiple files and folders
- **Auto-upload**: Automatically upload generated projects to the backend API

### Project Builder
- **Visual Project Builder**: Drag-and-drop interface for building projects
- **Real-time Collaboration**: Work together with team members using Socket.io
- **Code Editor Integration**: Full-featured code editor with collaboration features
- **Project Management**: Create, manage, and organize projects efficiently

### Authentication & User Management
- **Secure Authentication**: Complete sign-in/sign-up flow with OTP verification
- **Password Recovery**: Forgot password functionality with secure reset process
- **Protected Routes**: Role-based access control for different features

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern React with latest features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Monaco Editor**: Professional code editor
- **GSAP**: Animation library
- **Socket.io Client**: Real-time communication

### Backend & APIs
- **Node.js & Express**: Backend server
- **Socket.io**: Real-time collaboration
- **JWT Authentication**: Secure token-based auth
- **File Upload API**: Project file management

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **JSZip**: File compression and archive creation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/maulikpagada444/Inai_web_project_demo.git
   cd Inai_web_project_demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://your-api-url:8000
# Add other environment variables as needed
```

### API Endpoints
- Authentication: `/auth/*`
- Project Management: `/project/*`
- File Upload: `/auth/project/upload-folder`
- AI Chat: `/chat` and `/assistant/chat`

## 📁 Project Structure

```
src/
├── Web-Builder/                 # Web Builder Application
│   ├── Components/
│   │   ├── chat/               # AI Chat Components
│   │   ├── editor/             # Code editor Components
│   │   ├── preview/            # Live preview Components
│   │   ├── layout/             # Layout Components
│   │   └── ui/                 # Reusable UI Components
│   ├── app/                    # App router pages
│   ├── lib/                    # Utility libraries
│   └── assets/                 # Static assets
├── Project-Builder/            # Project Builder Application
│   ├── VsCode/                 # VSCode-like interface
│   ├── Components/             # Project builder Components
│   └── utils/                  # Utility functions
├── Components/                 # Shared Components
└── services/                   # Shared services
```

## 🚀 Getting Started

### Web Builder
1. Navigate to `/web-builder`
2. Sign in or create an account
3. Start building projects using AI-powered code generation
4. Preview your changes in real-time
5. Upload projects to the backend automatically

### Project Builder
1. Navigate to `/project-builder`
2. Create a new project or join an existing one
3. Use the visual builder to create your project structure
4. Collaborate with team members in real-time
5. Export or deploy your project

## 🔑 Key Features Explained

### AI Code Generation
- Natural language to code conversion
- Support for HTML, CSS, and JavaScript
- Context-aware suggestions based on existing code
- Multi-file project generation

### Real-time Collaboration
- Live code editing with multiple users
- Real-time cursor tracking
- Instant synchronization of changes
- Chat functionality for team communication

### Auto-upload Feature
- Automatically uploads generated code to backend
- Supports multiple file formats
- Preserves project structure
- Error handling and user feedback

## 🐛 Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version (requires Node 18+)
2. **API errors**: Verify environment variables and API endpoints
3. **CORS issues**: Ensure backend is properly configured
4. **Socket.io connection**: Check firewall and network settings

### Development Tips
- Use `npm run lint` to check code quality
- Clear browser cache if UI doesn't update
- Check browser console for detailed error messages
- Use React DevTools for debugging component issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast development experience
- Tailwind CSS for the utility-first CSS framework
- Monaco Editor for the professional code editing experience
- All contributors and users of this project