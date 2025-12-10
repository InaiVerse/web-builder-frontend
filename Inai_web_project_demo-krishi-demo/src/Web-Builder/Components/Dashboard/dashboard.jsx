import LeftSidebar from "./leftSidebar";
import Header from './Header.jsx';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { resetFormState } from "../Utils/projectStorage";

const CreateProject = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [newProjectName, setNewProjectName] = useState("Untitled Project");
    const [recentProjects, setRecentProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMenu, setShowMenu] = useState(null);
    const [deleteProjectId, setDeleteProjectId] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = Cookies.get("access_token");
            if (!token) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/list`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (result.status === true && Array.isArray(result.data)) {
                    console.log('Projects received from API:', result.data.map(p => ({ name: p.project_name, type: p.project_type })));
                    setRecentProjects(result.data);
                    setFilteredProjects(result.data);
                }
            } catch (error) {
                console.error("Fetch recent projects error:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleCardClick = (cardType) => {
        if (cardType === 'Web Builder') {
            setIsPopupOpen(true);
        } else {
            const pathMap = {
                'Project Builder': '/project-builder/joinproject',
                'IDE': '/web-builder/ide'
            };
            navigate(pathMap[cardType] || '/web-builder/dashboard');
        }
    };

    const handleConfirmCreate = async (name = null) => {
        const projectToCreate = (name && name.trim()) || (newProjectName && newProjectName.trim());
        if (!projectToCreate) return;

        const token = Cookies.get("access_token");
        if (!token) {
            navigate("/signin");
            return;
        }

        setIsLoading(true);

        try {
            resetFormState();

            const apiBases = [
                import.meta.env.VITE_API_URL
            ].filter(Boolean);

            let lastError = null;

            for (const baseUrl of apiBases) {
                try {
                    console.log(`Trying API endpoint: ${baseUrl}/auth/project/create`);

                    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/create`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            project_name: projectToCreate.trim(),
                            project_type: "web",
                            code: "" 
                        }),
                    });

                    console.log('Response status:', response.status);

                    if (!response.ok) {
                        let errorData;
                        try {
                            errorData = await response.json();
                            console.error('API Error:', errorData);

                            if (errorData.error === 'User not found') {
                                Cookies.remove('access_token');
                                navigate('/signin');
                                return;
                            }
                        } catch (e) {
                            console.error('Failed to parse error response:', e);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log('API Response:', result);

                    if (result.status === true) {
                        // Save project id + name into cookies (with secure & sameSite for better defaults)
                        Cookies.set("selected_project_id", result.data.project_id, {
                            expires: 7,
                            secure: window.location.protocol === "https:",
                            sameSite: "strict",
                        });
                        Cookies.set("selected_project_name", projectToCreate, {
                            expires: 7,
                            secure: window.location.protocol === "https:",
                            sameSite: "strict",
                        });
                        // Optionally also set a simple project_name key if you used it elsewhere
                        Cookies.set("project_name", projectToCreate, {
                            expires: 7,
                            secure: window.location.protocol === "https:",
                            sameSite: "strict",
                        });

                        // Store folder_name if present in response
                        if (result.data.folder_name) {
                            Cookies.set("selected_folder_name", result.data.folder_name, {
                                expires: 7,
                                secure: window.location.protocol === "https:",
                                sameSite: "strict",
                            });
                            console.log('Stored folder_name in cookie:', result.data.folder_name);
                        }

                        // Clear popup input if it was used
                        setProjectName("");
                        setIsPopupOpen(false);

                        // Navigate where you intended
                        navigate("/web-builder/input");
                    } else {
                        throw new Error(result.message || "Failed to create project");
                    }
                } catch (error) {
                    console.error(`Attempt with ${baseUrl} failed:`, error);
                    lastError = error;
                    alert("Error creating project. See console for details.");
                }
            }

            if (lastError) {
                throw lastError || new Error('All API endpoints failed. Please check your connection and try again.');
            }
        } catch (error) {
            console.error("Project create error:", error);
            alert(`Error: ${error.message || 'Failed to create project. Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };



    const handleOpenProject = async (projectName, projectId, projectType) => {
        const token = Cookies.get("access_token");
        if (!token) return navigate("/signin");

        // Determine if this is a Web Builder or Project Builder project
        const isWebProject = projectType === 'web' || projectType === 'website' || !projectType;
        console.log('Opening project:', { projectName, projectId, projectType, isWebProject });

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/fetch-folder`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_name: projectName,
                    project_id: projectId,
                    project_type: projectType || 'web',
                }),
            });

            const data = await res.json();

            if (data.status === true) {
                Cookies.set("selected_project_name", projectName, { expires: 7 });
                Cookies.set("selected_project_id", projectId, { expires: 7 });
                Cookies.set("selected_project_type", projectType || 'web', { expires: 7 });

                // Store folder_name if present in response
                const extractedFolderName = data?.folder_name || data?.data?.folder_name || data?.project_path?.split('\\').pop() || data?.project_path?.split('/').pop() || '';
                if (extractedFolderName) {
                    Cookies.set("selected_folder_name", extractedFolderName, { expires: 7 });
                    console.log('Stored folder_name for existing project:', extractedFolderName);
                }

                // Navigate based on project type
                if (isWebProject) {
                    navigate("/web-builder/builder");
                } else {
                    // For Project Builder, store data in sessionStorage and navigate
                    sessionStorage.setItem("projectData", JSON.stringify({
                        projectName: projectName,
                        projectCode: projectId,
                    }));
                    navigate("/project-builder/builder", {
                        state: { blueprint: data?.blueprint || data?.data?.blueprint || '' }
                    });
                }
            } else {
                alert(data.message || "Unable to fetch project folder!");
            }
        } catch (err) {
            console.error("Error fetching project folder:", err);
        }
    };

    const handleDeleteConfirm = (projectId) => {
        setDeleteProjectId(projectId);
        setShowMenu(null);
    };

    const handleDeleteProject = async () => {
        const token = Cookies.get("access_token");
        if (!token) return navigate("/signin");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    project_id: deleteProjectId,
                }),
            });

            const data = await response.json();

            if (data.status === true) {
                const updatedProjects = recentProjects.filter(p => p.project_id !== deleteProjectId);
                setRecentProjects(updatedProjects);
                setFilteredProjects(updatedProjects);
                alert("Project Deleted Successfully!");
            } else {
                alert(data.message || "Failed to delete project!");
            }
        } catch (error) {
            console.error("Delete Error:", error);
        } finally {
            setDeleteProjectId(null);
        }
    };

    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);

        if (searchValue.trim() === '') {
            setFilteredProjects(recentProjects);
        } else {
            const filtered = recentProjects.filter(project =>
                project.project_name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans flex-col md:flex-row">
            <LeftSidebar />

            <main className="flex-1 overflow-y-auto">
                <Header onSearch={handleSearch} />

                <div className="py-8 px-12">
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {/* Purple Card */}
                        <div className="relative py-12 px-6 cursor-pointer text-center min-h-[220px] flex flex-col items-center justify-center border border-[#E8D5FF] bg-[#F8F5FF] hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 group" onClick={() => handleCardClick('Web Builder')}>
                            <div className="absolute w-2 h-2 bg-[#8b5cf6] rounded-[1px] -top-1 -left-1"></div>
                            <div className="absolute w-2 h-2 bg-[#8b5cf6] rounded-[1px] -top-1 -right-1"></div>
                            <div className="absolute w-2 h-2 bg-[#8b5cf6] rounded-[1px] -bottom-1 -left-1"></div>
                            <div className="absolute w-2 h-2 bg-[#8b5cf6] rounded-[1px] -bottom-1 -right-1"></div>
                            <button
                                className="w-12 h-12 rounded-full border border-[#8b5cf6] bg-white text-2xl font-light cursor-pointer mb-5 flex items-center justify-center text-[#8b5cf6] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#8b5cf6] group-hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick('Web Builder');
                                }}
                            >+</button>
                            <h2 className="text-lg font-bold m-0 mb-2 text-[#6d28d9]">Web Builder</h2>
                            <p className="text-xs text-[#666666] m-0">Generate 10 min ago</p>
                        </div>

                        {/* Orange Card */}
                        <div className="relative py-12 px-6 cursor-pointer text-center min-h-[220px] flex flex-col items-center justify-center border border-[#FFE5D5] bg-[#FFF8F5] hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 group" onClick={() => handleCardClick('Project Builder')}>
                            <div className="absolute w-2 h-2 bg-[#f97316] rounded-[1px] -top-1 -left-1"></div>
                            <div className="absolute w-2 h-2 bg-[#f97316] rounded-[1px] -top-1 -right-1"></div>
                            <div className="absolute w-2 h-2 bg-[#f97316] rounded-[1px] -bottom-1 -left-1"></div>
                            <div className="absolute w-2 h-2 bg-[#f97316] rounded-[1px] -bottom-1 -right-1"></div>
                            <button className="w-12 h-12 rounded-full border border-[#f97316] bg-white text-2xl font-light cursor-pointer mb-5 flex items-center justify-center text-[#f97316] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#f97316] group-hover:text-white">+</button>
                            <h2 className="text-lg font-bold m-0 mb-2 text-[#ea580c]">Project Builder</h2>
                            <p className="text-xs text-[#666666] m-0">Generate 10 min ago</p>
                        </div>

                        <div
                            className="relative py-12 px-6 cursor-not-allowed text-center min-h-[220px] flex flex-col items-center justify-center border border-[#D5FFE8] bg-[#F5FFF8] opacity-75"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div className="absolute w-2 h-2 bg-[#10b981] rounded-[1px] -top-1 -left-1"></div>
                            <div className="absolute w-2 h-2 bg-[#10b981] rounded-[1px] -top-1 -right-1"></div>
                            <div className="absolute w-2 h-2 bg-[#10b981] rounded-[1px] -bottom-1 -left-1"></div>
                            <div className="absolute w-2 h-2 bg-[#10b981] rounded-[1px] -bottom-1 -right-1"></div>

                            <button
                                className="w-12 h-12 rounded-full border border-[#10b981]/60 bg-white text-2xl font-light mb-5 flex items-center justify-center text-[#10b981]/60"
                                disabled
                            >
                                +
                            </button>

                            <h2 className="text-lg font-semibold m-0 mb-2 text-[#059669]/80">IDE</h2>
                            <p className="text-[11px] text-[#059669]/60 font-medium">Coming Soon</p>
                        </div>

                    </section>

                    {/* Recents */}
                    <section className="mt-12">
                        <h2 className="text-lg font-bold mb-6 text-[#333333]">Recents</h2>

                        {filteredProjects.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                {searchTerm ? 'No projects found matching your search...' : 'No projects yet...'}
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProjects.map((project) => (
                                    <div
                                        key={project.project_id}
                                        className="bg-[#F8F9FA] border relative border-[#e0e0e0] rounded-xl p-4 hover:shadow-md group"
                                    >
                                        <div
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenProject(project.project_name, project.project_id, project.project_type);
                                            }}
                                        >
                                            {/* Project Type */}
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-md ${project.project_type === "project"
                                                    ? "bg-orange-200 text-orange-700"
                                                    : "bg-violet-200 text-violet-700"
                                                    }`}
                                                title={`Type: ${project.project_type || 'null'}`}
                                            >
                                                {project.project_type === "project" ? "Project Builder" : "Web Builder"}
                                            </span>

                                            {/* Project Name */}
                                            <h3 className="text-base font-medium text-[#333333] mt-2">
                                                {project.project_name}
                                            </h3>

                                            {/* Created Date */}
                                            <p className="text-xs text-[#888888]">
                                                Created: {project.created_at?.slice(0, 10)}
                                            </p>
                                        </div>

                                        {/* 3 dots menu */}
                                        <button
                                            className="absolute top-2 right-2 p-1 bg-transparent hover:bg-gray-200 rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(showMenu === project.project_id ? null : project.project_id);
                                            }}
                                        >
                                            ⋮
                                        </button>

                                        {showMenu === project.project_id && (
                                            <div className="absolute top-8 right-2 w-24 bg-white shadow-md border rounded-md z-50"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100 text-sm"
                                                    onClick={() => handleDeleteConfirm(project.project_id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Create Project Popup */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
                    <div className="bg-[#1d1d1d] rounded-xl p-6 w-[350px] border border-white/10 text-white">
                        <h2 className="text-lg font-semibold mb-3">Create New Project</h2>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full p-2 rounded-lg bg-white/10 text-white mb-4"
                            placeholder="Enter Project Name"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-2 bg-gray-600 rounded-lg"
                                onClick={() => setIsPopupOpen(false)}
                            >Cancel</button>

                            <button
                                className="px-4 py-2 bg-blue-600 rounded-lg"
                                onClick={() => handleConfirmCreate(projectName)}
                            >Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteProjectId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
                    <div className="bg-white rounded-xl p-6 w-[400px] border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                onClick={() => setDeleteProjectId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={handleDeleteProject}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CreateProject;
