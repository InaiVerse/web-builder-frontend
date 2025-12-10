import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
// Custom hook ki jagah ab library import kar rahe hain
import { useTypewriter } from 'react-simple-typewriter';
import { useState } from 'react';
import Inai_black from '@/Web-Builder/assets/inai-black.png';
import Cookies from 'js-cookie';

const JoinPage = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [formData, setFormData] = useState({ username: '', projectCode: '', projectName: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [showPassword, setShowPassword] = useState({ projectName: false, projectCode: false });
    const navigate = useNavigate();

    // react-simple-typewriter hook implementation
    const [placeholderText] = useTypewriter({
        words: ['Example: "Explain quantum computing in simple terms"'],
        loop: true, // Loop infinite times
        typeSpeed: 50,
        deleteSpeed: 50,
        delaySpeed: 1000,
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Creating project...' });

        const token = Cookies.get("access_token");
        if (!token) {
            setStatus({ type: 'error', msg: 'Please login first!' });
            setTimeout(() => navigate('/signin'), 1000);
            return;
        }

        try {
            // Call backend API to create project with project_type: "project"
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_name: formData.projectName.trim(),
                    project_type: "project",
                    code: formData.projectCode.trim() // User entered code
                }),
            });


            const result = await response.json();
            console.log('Project Builder - Create Response:', result);

            if (result.status === true) {
                // Store project data in sessionStorage
                sessionStorage.setItem("projectData", JSON.stringify({
                    ...formData,
                    projectId: result.data.project_id,
                    projectCode: result.data.project_id || formData.projectCode.trim(),
                    projectName: formData.projectName.trim(),
                    blueprint: result.data.project_structure || result.data.files || null
                }));

                // Also store in cookies for consistency
                Cookies.set("selected_project_id", result.data.project_id, { expires: 7 });
                Cookies.set("selected_project_name", formData.projectName.trim(), { expires: 7 });
                Cookies.set("selected_project_type", 'project', { expires: 7 });
                Cookies.set("project_name", formData.projectName.trim(), { expires: 7 });

                console.log("Project created with structure:", !!result.data.project_structure);

                setStatus({ type: 'success', msg: 'Project created! Redirecting...' });
                setTimeout(() => {
                    // Navigate with blueprint if structure exists
                    if (result.data.project_structure || result.data.files) {
                        navigate('/project-builder/builder', { 
                            state: { 
                                blueprint: result.data.project_structure || result.data.files 
                            } 
                        });
                    } else {
                        navigate('/project-builder/input');
                    }
                }, 500);
            } else {
                setStatus({ type: 'error', msg: result.message || 'Failed to create project' });
            }
        } catch (error) {
            console.error("Project create error:", error);
            setStatus({ type: 'error', msg: 'Error creating project. Please try again.' });
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Joining project...' });

        const token = Cookies.get("access_token");
        if (!token) {
            setStatus({ type: 'error', msg: 'Please login first!' });
            setTimeout(() => navigate('/signin'), 1000);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/join-project`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_name: formData.projectName.trim(),
                    code: formData.projectCode.trim()
                }),
            });

            const result = await response.json();
            console.log('Join Project Response:', result);

            if (result.status === true) {
                sessionStorage.setItem("projectData", JSON.stringify({
                    projectCode: formData.projectCode.trim(),
                    projectName: formData.projectName.trim(),
                    username: formData.username,
                    projectId: result.data.project_id
                }));

                Cookies.set("selected_project_id", result.data.project_id, { expires: 7 });
                Cookies.set("selected_project_name", formData.projectName.trim(), { expires: 7 });

                setStatus({ type: 'success', msg: 'Joined successfully! Redirecting...' });
                setTimeout(() => {
                    // Check if project structure is included in the response
                    if (result.data.project_structure || result.data.files) {
                        // Navigate with project data as blueprint
                        navigate('/project-builder/builder', { 
                            state: { 
                                blueprint: result.data.project_structure || result.data.files 
                            } 
                        });
                    } else {
                        // Navigate normally - will fetch from backend
                        navigate('/project-builder/builder');
                    }
                }, 800);
            } else {
                setStatus({ type: 'error', msg: result.message || 'Failed to join project' });
            }
        } catch (error) {
            console.error("Join project error:", error);
            setStatus({ type: 'error', msg: 'Error joining project. Please try again.' });
        }
    };


    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="flex flex-1 flex-col mx-8 md:mx-8 lg:mx-16 border-x border-black relative">
                <div className="absolute top-[3.75rem] -left-1 w-2 h-2 bg-black"></div>
                <div className="absolute top-[3.75rem] -right-1 w-2 h-2 bg-black"></div>
                <div className="relative mt-16 border-t border-black shrink-0"></div>

                <div className='flex flex-1'>
                    {/* Left Section - Branding */}
                    <div className="flex-1 flex items-center justify-center p-10 relative min-h-[400px] lg:min-h-auto">
                        <div className="w-full max-w-[540px] h-[500px] bg-white border-2 border-[#333333] relative flex flex-col items-center justify-center py-[60px] px-10">
                            {/* Corner Boxes of the inner white box */}
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -top-[7px] -left-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -top-[7px] -right-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -bottom-[7px] -left-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -bottom-[7px] -right-[7px]"></div>

                            {/* Logo */}
                            <div className="text-center mb-20">
                                <img src={Inai_black} alt="INAI WORLDS Logo" className="max-w-full h-auto max-h-[150px] object-contain" />
                            </div>

                            {/* Example Input */}
                            <div className="w-full max-w-[400px] relative">
                                <input
                                    type="text"
                                    placeholder={placeholderText} // Dynamic text from library hook
                                    readOnly
                                    className="w-full p-3 pr-12 border border-[#cccccc] rounded text-sm text-[#666666] outline-none focus:border-[#333333] transition-colors"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-[#cccccc] rounded p-1.5 cursor-pointer flex items-center justify-center hover:bg-[#f0f0f0]">
                                    <IoSend size={16} color="#999999" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className="flex-1 flex items-center justify-center p-10 bg-[#F1F5F9]">
                        <div className="w-full max-w-[400px]">
                            <div className="text-center mb-[30px]">
                                <h2 className="text-2xl font-bold text-[#333] m-0 mb-2">Team Code Chat</h2>
                                <p className="text-[13px] text-[#666] m-0">Collaborate on code with your team in real-time</p>
                            </div>

                            <div className="flex gap-3 mb-[30px] flex-col sm:flex-row">
                                <button
                                    className={`flex-1 py-3 px-5 text-sm font-semibold rounded-md cursor-pointer transition-all ${activeTab === 'create'
                                        ? 'bg-[#2d2d2d] text-white border border-[#2d2d2d]'
                                        : 'bg-white text-black border border-[#d0d0d0] hover:bg-white hover:text-black hover:border-black'
                                        }`}
                                    onClick={() => setActiveTab('create')}
                                >
                                    Create Project
                                </button>
                                <button
                                    className={`flex-1 py-3 px-5 text-sm font-semibold rounded-md cursor-pointer transition-all ${activeTab === 'join'
                                        ? 'bg-[#2d2d2d] text-white border border-[#2d2d2d]'
                                        : 'bg-white text-black border border-[#d0d0d0] hover:bg-white hover:text-black hover:border-black'
                                        }`}
                                    onClick={() => setActiveTab('join')}
                                >
                                    Join Project
                                </button>
                            </div>

                            {status.msg && (
                                <div className={`p-3 px-4 rounded-lg text-[13px] mb-5 text-center border ${status.type === 'success' ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]' : status.type === 'error' ? 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]' : 'bg-[#d1ecf1] text-[#0c5460] border-[#bee5eb]'}`}>{status.msg}</div>
                            )}

                            {activeTab === 'create' ? (
                                <form onSubmit={handleCreate} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[13px] font-semibold text-[#555]">Project Name</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-base text-[#999] pointer-events-none"><FaLock color="#999" /></span>
                                            <input type={showPassword.projectName ? "text" : "password"} required value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })} placeholder="Project Name" className="w-full py-3 px-10 border border-[#d0d0d0] rounded-lg text-sm text-[#333] bg-white outline-none transition-colors focus:border-[#666]" />
                                            <span className="absolute right-3 text-base text-[#999] cursor-pointer flex items-center justify-center hover:opacity-70" onClick={() => togglePasswordVisibility('projectName')}>
                                                {showPassword.projectName ? <FaEyeSlash color="#999" /> : <FaEye color="#999" />}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[13px] font-semibold text-[#555]">Project Code</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-base text-[#999] pointer-events-none"><FaLock color="#999" /></span>
                                            <input type={showPassword.projectCode ? "text" : "password"} required value={formData.projectCode} onChange={e => setFormData({ ...formData, projectCode: e.target.value })} placeholder="Project Code" className="w-full py-3 px-10 border border-[#d0d0d0] rounded-lg text-sm text-[#333] bg-white outline-none transition-colors focus:border-[#666]" />
                                            <span className="absolute right-3 text-base text-[#999] cursor-pointer flex items-center justify-center hover:opacity-70" onClick={() => togglePasswordVisibility('projectCode')}>
                                                {showPassword.projectCode ? <FaEyeSlash color="#999" /> : <FaEye color="#999" />}
                                            </span>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full p-3.5 bg-[#2d2d2d] text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all mt-2.5 hover:bg-[#1a1a1a] hover:-translate-y-px hover:shadow-md">Create Project</button>
                                </form>
                            ) : (
                                <form onSubmit={handleJoin} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[13px] font-semibold text-[#555]">Project Name</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-base text-[#999] pointer-events-none"><FaLock color="#999" /></span>
                                            <input type={showPassword.projectName ? "text" : "password"} required value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })} placeholder="Project Name" className="w-full py-3 px-10 border border-[#d0d0d0] rounded-lg text-sm text-[#333] bg-white outline-none transition-colors focus:border-[#666]" />
                                            <span className="absolute right-3 text-base text-[#999] cursor-pointer flex items-center justify-center hover:opacity-70" onClick={() => togglePasswordVisibility('projectName')}>
                                                {showPassword.projectName ? <FaEyeSlash color="#999" /> : <FaEye color="#999" />}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[13px] font-semibold text-[#555]">Project Code</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-base text-[#999] pointer-events-none"><FaLock color="#999" /></span>
                                            <input type={showPassword.projectCode ? "text" : "password"} required value={formData.projectCode} onChange={e => setFormData({ ...formData, projectCode: e.target.value })} placeholder="Project Code" className="w-full py-3 px-10 border border-[#d0d0d0] rounded-lg text-sm text-[#333] bg-white outline-none transition-colors focus:border-[#666]" />
                                            <span className="absolute right-3 text-base text-[#999] cursor-pointer flex items-center justify-center hover:opacity-70" onClick={() => togglePasswordVisibility('projectCode')}>
                                                {showPassword.projectCode ? <FaEyeSlash color="#999" /> : <FaEye color="#999" />}
                                            </span>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full p-3.5 bg-[#2d2d2d] text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all mt-2.5 hover:bg-[#1a1a1a] hover:-translate-y-px hover:shadow-md">Join Project</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinPage;