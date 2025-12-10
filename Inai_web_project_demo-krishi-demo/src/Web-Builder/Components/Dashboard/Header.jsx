// import PropTypes from "prop-types";
// import Cookies from "js-cookie";
// import { HiOutlineMenu } from "react-icons/hi";
// import { FaPlus } from "react-icons/fa6";
// import { CgProfile } from "react-icons/cg";
// import { CiGift } from "react-icons/ci";
// import { CgDarkMode } from "react-icons/cg";
// import { IoIosSettings } from "react-icons/io";
// import { IoLogOut } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";

// export default function Header({
//     title,
//     className = "",
//     onToggleSidebar,
//     showSidebarToggle = true,
//     onCreateProject,
//     showNewProjectButtons = true,
//     onToggleProfile,
//     isProfileOpen,
//     showProfile = true,
//     userName = "Guest",
//     rightExtra = null,
//     showCreditButton = true,
//     creditLabel = "10 Credit",
//     onCreditClick,
// }) {
//     const cookieUser = Cookies.get("username");
//     const finalUserName = cookieUser || userName;
//     const navigate = useNavigate();

//     const shouldShowProfile =
//         showProfile && typeof onToggleProfile === "function" && typeof isProfileOpen === "boolean";

//     const handleSidebarClick = (event) => {
//         event.stopPropagation();
//         if (typeof onToggleSidebar === "function") {
//             onToggleSidebar(event);
//         }
//     };

//     const handleLogout = async () => {
//         try {
//             const token = Cookies.get("access_token");

//             if (!token) {
//                 console.log("No token found");
//                 Cookies.remove("access_token");
//                 Cookies.remove("username");
//                 Cookies.remove("email");
//                 Cookies.remove("refresh_token");
//                 Cookies.remove("user_id");
//                 Cookies.remove("project_id");
//                 Cookies.remove("selected_project_name");
//                 Cookies.remove("selected_project_id");
//                 navigate("/signin");
//                 return;
//             }

//             const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (!res.ok) {
//                 console.warn("Logout API error, clearing cookies anyway...");
//             }

//             Cookies.remove("access_token");
//             Cookies.remove("username");
//             Cookies.remove("email");
//             Cookies.remove("refresh_token");
//             Cookies.remove("user_id");
//             Cookies.remove("project_id");
//             Cookies.remove("selected_project_name");
//             Cookies.remove("selected_project_id");
//             navigate("/signin");
//         } catch (error) {
//             console.error("Logout Error:", error);

//             Cookies.remove("access_token");
//             Cookies.remove("username");
//             Cookies.remove("email");
//             Cookies.remove("refresh_token");
//             Cookies.remove("user_id");
//             Cookies.remove("project_id");
//             Cookies.remove("selected_project_name");
//             Cookies.remove("selected_project_id");
//             navigate("/signin");
//         }
//     };


//     const handleProfileClick = (event) => {
//         event.stopPropagation();
//         if (typeof onToggleProfile === "function") {
//             onToggleProfile(event);
//         }
//     };

//     return (
//         <header className={`relative z-20 bg-[#101010] border-b border-white/5 max-h-[4rem] ${className}`.trim()}>
//             <div className="flex min-h-[4rem] w-full items-center justify-between gap-3 px-4 py-2">

//                 <div className="flex items-center gap-3">
//                     {showSidebarToggle ? (
//                         <button
//                             onClick={handleSidebarClick}
//                             className="inline-flex w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
//                         >
//                             <HiOutlineMenu className="h-5 w-5" />
//                         </button>
//                     ) : null}

//                     {title && <h4 className="text-base font-semibold text-white sm:text-lg">{title}</h4>}
//                 </div>

//                 <div className="flex items-center gap-3 sm:gap-4">
//                     {showCreditButton && (
//                         <button
//                             onClick={onCreditClick}
//                             className="flex h-9 cursor-pointer items-center justify-center rounded-full bg-white px-4 text-xs font-semibold text-black transition hover:bg-white/90 sm:h-10 sm:text-sm"
//                         >
//                             {creditLabel}
//                         </button>
//                     )}

//                     {rightExtra}

//                     {showNewProjectButtons && typeof onCreateProject === "function" && (
//                         <>
//                             <button
//                                 className="hidden h-9 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold text-white transition hover:shadow-lg sm:inline-flex sm:h-10 sm:text-sm"
//                                 style={{ background: "linear-gradient(92deg, #FF7BAC 0%, #905CFF 100%)" }}
//                                 onClick={onCreateProject}
//                             >
//                                 <FaPlus className="h-4 w-4" />
//                                 <span className="hidden sm:inline cursor-pointer">New Project</span>
//                             </button>
//                             <button
//                                 className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10 sm:hidden"
//                                 style={{ background: "linear-gradient(92deg, #FF7BAC 0%, #905CFF 100%)" }}
//                                 onClick={onCreateProject}
//                             >
//                                 <FaPlus className="h-4 w-4" />
//                             </button>
//                         </>
//                     )}

//                     {shouldShowProfile && (
//                         <div className="relative cursor-pointer" onClick={(e) => e.stopPropagation()}>
//                             <button
//                                 onClick={handleProfileClick}
//                                 className="flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-xs font-semibold text-white transition hover:text-gray-200 sm:h-10 sm:px-5 sm:text-sm"
//                                 style={{
//                                     borderRadius: "9999px",
//                                     backgroundImage:
//                                         "linear-gradient(#101010, #101010), linear-gradient(92deg, #FF7BAC 0%, #905CFF 100%)",
//                                     backgroundOrigin: "border-box",
//                                     backgroundClip: "padding-box, border-box",
//                                     border: "1px solid transparent",
//                                 }}
//                             >
//                                 <CgProfile className="h-5 w-5" />
//                                 <span >{finalUserName}</span>
//                             </button>

//                             {isProfileOpen && (
//                                 <div className="profile-dropdown absolute right-0 mt-3 w-56 rounded-2xl border border-white/5 p-4 text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
//                                     <div className="flex items-center justify-center">
//                                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
//                                             <CgProfile className="h-6 w-6" />
//                                         </div>
//                                     </div>

//                                     <ul className="mt-4 space-y-3 text-sm">
//                                         <li className="dropdown-item">
//                                             <CiGift className="mr-2 h-5 w-5" /> Get free credits
//                                         </li>
//                                         <li className="dropdown-item"
//                                             onClick={() => navigate("/appearance")}
//                                         >
//                                             <CgDarkMode className="mr-2 h-5 w-5" /> Appearance
//                                         </li>
//                                         <li className="dropdown-item"
//                                             onClick={() => navigate("/profile")}
//                                         >
//                                             <IoIosSettings className="mr-2 h-5 w-5" /> Settings
//                                         </li>
//                                     </ul>

//                                     <div className="mt-4 border-t border-white/5 pt-3 pl-5">
//                                         <button
//                                             onClick={handleLogout}
//                                             className="flex w-full cursor-pointer items-center justify-start gap-2 text-sm font-semibold text-red-500 transition hover:text-red-400"
//                                         >
//                                             <IoLogOut className="h-5 w-5" />
//                                             Logout
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                 </div>
//             </div>
//         </header>
//     );
// }
// Header.propTypes = {
//     title: PropTypes.string,
//     className: PropTypes.string,
//     onToggleSidebar: PropTypes.func,
//     showSidebarToggle: PropTypes.bool,
//     onCreateProject: PropTypes.func,
//     showNewProjectButtons: PropTypes.bool,
//     onToggleProfile: PropTypes.func,
//     isProfileOpen: PropTypes.bool,
//     showProfile: PropTypes.bool,
//     userName: PropTypes.string,
//     rightExtra: PropTypes.node,
//     showCreditButton: PropTypes.bool,
//     creditLabel: PropTypes.string,
//     onCreditClick: PropTypes.func,
// };
// Header.defaultProps = {
//     title: undefined,
//     className: "",
//     onToggleSidebar: undefined,
//     showSidebarToggle: true,
//     onCreateProject: undefined,
//     showNewProjectButtons: true,
//     onToggleProfile: undefined,
//     isProfileOpen: undefined,
//     showProfile: true,
//     userName: "Guest",
//     rightExtra: null,
//     showCreditButton: true,
//     creditLabel: "10 Credit",
//     onCreditClick: undefined,
// };






















import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { CgProfile, CgDarkMode } from 'react-icons/cg';
import { CiGift } from 'react-icons/ci';
import { IoIosSettings } from 'react-icons/io';
import { IoLogOut } from 'react-icons/io5';

// --- Imports for Header 2 ---
import { SearchIcon, PcIcon, LightModeIcon, DarkModeIcon, ProfileIcon } from "@/Web-Builder/icons/Icons"

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const cookieUser = Cookies.get("username");

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = async () => {
        try {
            const token = Cookies.get("access_token");

            if (!token) {
                console.log("No token found");
                Cookies.remove("access_token");
                Cookies.remove("username");
                Cookies.remove("email");
                Cookies.remove("refresh_token");
                Cookies.remove("user_id");
                Cookies.remove("project_id");
                Cookies.remove("selected_project_name");
                Cookies.remove("selected_project_id");
                navigate("/signin");
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.warn("Logout API error, clearing cookies anyway...");
            }

            Cookies.remove("access_token");
            Cookies.remove("username");
            Cookies.remove("email");
            Cookies.remove("refresh_token");
            Cookies.remove("user_id");
            Cookies.remove("project_id");
            Cookies.remove("selected_project_name");
            Cookies.remove("selected_project_id");
            navigate("/signin");
        } catch (error) {
            console.error("Logout Error:", error);

            Cookies.remove("access_token");
            Cookies.remove("username");
            Cookies.remove("email");
            Cookies.remove("refresh_token");
            Cookies.remove("user_id");
            Cookies.remove("project_id");
            Cookies.remove("selected_project_name");
            Cookies.remove("selected_project_id");
            navigate("/signin");
        }
    };

    const handleProfileClick = (e) => {
        e.stopPropagation();
        toggleProfile();
    };
    return (
        <header className="bg-white flex justify-between items-center py-4 px-8 w-full border-b-2 border-[#000000]">
            <div className="w-[300px]">
                <div className="flex items-center gap-2.5 p-2.5 px-4 border border-[#e0e0e0] rounded-full bg-white transition-colors focus-within:border-[#333333]">
                    <SearchIcon width={16} height={16} color="#999999" />
                    <input type="text" placeholder="Search" className="border-none outline-none w-full text-sm text-[#333333] bg-transparent placeholder-[#999999]" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-[#e0e0e0] rounded-full p-1">
                    <button className="border-none bg-none w-8 h-8 rounded-full text-[#333333] flex items-center justify-center cursor-pointer transition-all hover:bg-[#f5f5f5]">
                        <PcIcon width={16} height={16} />
                    </button>
                    <button className="border-none bg-none w-8 h-8 rounded-full text-[#999999] flex items-center justify-center cursor-pointer transition-all hover:bg-[#f5f5f5] hover:text-[#333333]">
                        <LightModeIcon width={16} height={16} />
                    </button>
                    <button className="border-none bg-none w-8 h-8 rounded-full text-[#999999] flex items-center justify-center cursor-pointer transition-all hover:bg-[#f5f5f5] hover:text-[#333333]">
                        <DarkModeIcon width={16} height={16} />
                    </button>
                </div>
                <div className="relative cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={handleProfileClick}
                        className="flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-xs font-semibold text-white transition hover:text-gray-200 sm:h-10 sm:px-5 sm:text-sm"
                        style={{
                            borderRadius: "9999px",
                            backgroundImage:
                                "linear-gradient(#101010, #101010), linear-gradient(92deg, #FF7BAC 0%, #905CFF 100%)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "padding-box, border-box",
                            border: "1px solid transparent",
                        }}
                    >
                        <CgProfile className="h-5 w-5" />
                        <span>{cookieUser || 'User'}</span>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1a1a1a] border border-white/5 p-4 text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)] z-50">
                            <div className="flex items-center justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                                    <CgProfile className="h-6 w-6" />
                                </div>
                            </div>

                            <ul className="mt-4 space-y-3 text-sm">
                                <li className="dropdown-item">
                                    <CiGift className="mr-2 h-5 w-5" /> Get free credits
                                </li>
                                <li className="dropdown-item cursor-pointer hover:bg-white/5 p-2 rounded-lg"
                                    onClick={() => navigate("/appearance")}
                                >
                                    <CgDarkMode className="mr-2 h-5 w-5 inline" /> Appearance
                                </li>
                                <li className="dropdown-item cursor-pointer hover:bg-white/5 p-2 rounded-lg"
                                    onClick={() => navigate("/profile")}
                                >
                                    <IoIosSettings className="mr-2 h-5 w-5 inline" /> Settings
                                </li>
                            </ul>

                            <div className="mt-4 border-t border-white/5 pt-3">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full cursor-pointer items-center justify-start gap-2 text-sm font-semibold text-red-500 transition hover:text-red-400 p-2 rounded-lg hover:bg-white/5"
                                >
                                    <IoLogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;