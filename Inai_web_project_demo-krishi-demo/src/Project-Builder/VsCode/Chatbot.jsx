import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, FileCode, ArrowUp } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = "http://192.168.208.1:1000/api/chat/generate-project";

// Helper function to get project name from sessionStorage
const getProjectName = () => {
    try {
        const stored = sessionStorage.getItem('projectData');
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed?.projectName || parsed?.project_name || '';
        }
    } catch (e) {
        console.warn('Failed to parse projectData from sessionStorage:', e);
    }
    return '';
};

const Chatbot = ({ onProjectUpdate, blueprint }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI Project Builder. Describe your project or upload files to get started.' }
    ]);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [projectName, setProjectName] = useState('');
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        console.log("Session Created:", newSessionId);

        // Get project name from sessionStorage
        const storedProjectName = getProjectName();
        if (storedProjectName) {
            setProjectName(storedProjectName);
            console.log("Project Name Loaded:", storedProjectName);
        }
    }, []);

    const hasSubmittedBlueprint = useRef(false);

    useEffect(() => {
        if (blueprint && !hasSubmittedBlueprint.current) {
            hasSubmittedBlueprint.current = true;
            setMessages(prev => [
                ...prev,
                { role: "user", content: "Generate project from blueprint", blueprint: true }
            ]);
            handleGenerateFromBlueprint(blueprint);
        }
    }, [blueprint]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleGenerateFromBlueprint = async (blueprintText) => {
        setIsLoading(true);

        try {
            const userId = Cookies.get('user_id') || 10;
            const projectId = Cookies.get('selected_project_id');

            console.log("Calling API with:", {
                message: blueprintText?.substring(0, 100) + "...",
                session_id: sessionId,
                project_name: projectName || getProjectName() || 'generated-project',
                user_id: userId,
                project_id: projectId
            });

            const response = await axios.post(API_URL, {
                message: blueprintText,
                session_id: sessionId,
                project_name: projectName || getProjectName() || 'generated-project',
                user_id: userId,
                project_id: projectId
            });

            console.log("Full API Response:", response);
            console.log("Response Data:", response.data);

            const data = response.data;

            if (data.session_id && data.session_id !== sessionId) {
                setSessionId(data.session_id);
            }

            // Show assistant message
            const responseText = data.response || data.message || "Project generated successfully";
            setMessages(prev => [...prev, { role: "assistant", content: responseText }]);

            // Try to find project_structure in different possible locations
            const projectStructure = data.project_structure
                || data.data?.project_structure
                || data.structure
                || data.files;

            console.log("Extracted project_structure:", projectStructure);

            if (projectStructure) {
                console.log("Calling onProjectUpdate with structure:", projectStructure);
                onProjectUpdate(projectStructure);
                setMessages(prev => [...prev, {
                    role: 'system',
                    content: 'Project structure generated.',
                    details: projectStructure
                }]);
            } else {
                console.warn("No project_structure found in response. Available keys:", Object.keys(data));
                // Still try to show what we got
                if (data.folder_name) {
                    console.log("Project saved to folder:", data.folder_name);
                }
            }

        } catch (error) {
            console.error("Error generating project:", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error.message
            });
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Sorry, something went wrong generating the project. ${error?.response?.data?.detail || error.message || ''}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && files.length === 0) return;

        const fileContents = await Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) =>
                    resolve({ name: file.name, content: e.target.result });
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }));

        const userMessage = { role: "user", content: input, files: files.map(f => f.name) };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            console.log("Submitting message with:", { input, files: fileContents.length });

            const response = await axios.post(API_URL, {
                message: input,
                files: fileContents,
                session_id: sessionId,
                project_name: projectName || getProjectName() || 'generated-project'
            });

            console.log("Submit Response:", response.data);
            const data = response.data;

            if (data.session_id && data.session_id !== sessionId) {
                setSessionId(data.session_id);
            }

            const responseText = data.response || data.message || "Done";
            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

            // Try to find project_structure in different possible locations
            const projectStructure = data.project_structure
                || data.data?.project_structure
                || data.structure
                || data.files;

            if (projectStructure) {
                console.log("Updating project with structure:", projectStructure);
                onProjectUpdate(projectStructure);
                setMessages(prev => [...prev, {
                    role: "system",
                    content: "Project structure updated.",
                    details: projectStructure
                }]);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Sorry, something went wrong. ${error?.response?.data?.detail || error.message || ''}`
            }]);
        } finally {
            setIsLoading(false);
            setInput("");
            setFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#181818] text-[#cccccc] border-l border-[#2b2b2b] font-sans">
            <div className="h-10 bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-center px-4">
                <div className="bg-[#2a2d2e] text-[#858585] text-xs px-3 py-1 rounded w-full text-center max-w-md">
                    http://localhost:3000
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        {msg.role === "system" ? (
                            <div className="w-full text-sm font-mono text-[#858585] mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-green-500">✔</span> Files Updated:
                                </div>
                                <div className="pl-5 border-l border-[#2b2b2b] ml-1">
                                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(msg.details, null, 2)}</pre>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`max-w-[90%] ${msg.role === "user" ? "bg-[#2a2d2e] text-white" : "text-[#cccccc]"
                                    } rounded-lg p-3 text-sm`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                {msg.files?.length > 0 && (
                                    <div className="mt-2 text-xs text-[#858585] flex gap-2 flex-wrap">
                                        {msg.files.map((f, i) => (
                                            <span key={i} className="bg-[#1e1e1e] px-1 py-1 rounded border border-[#333]">{f}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="text-[#858585] text-sm animate-pulse">Generating...</div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#181818]">
                <form onSubmit={handleSubmit} className="relative">

                    {files.length > 0 && (
                        <div className="absolute bottom-full mb-2 left-0 flex flex-wrap gap-2">
                            {files.map((f, i) => (
                                <span key={i} className="text-xs bg-[#2a2d2e] text-[#cccccc] px-2 py-1 rounded flex items-center gap-1 border border-[#333]">
                                    <FileCode size={12} /> {f.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="bg-[#2a2d2e] rounded-xl border border-[#333] flex items-center p-1 pl-3">
                        <button type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[#858585] hover:text-[#cccccc] p-1">
                            <Paperclip size={18} />
                        </button>

                        <input type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <input type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything"
                            className="flex-1 bg-transparent text-[#cccccc] px-3 py-2 text-sm focus:outline-none"
                        />

                        <button type="submit"
                            disabled={isLoading}
                            className={`p-2 rounded-lg transition-all ${input.trim() || files.length > 0
                                ? "bg-[#e05a3d] text-white hover:bg-[#c44930]"
                                : "bg-[#333] text-[#666] cursor-not-allowed"
                                }`}>
                            <ArrowUp size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
