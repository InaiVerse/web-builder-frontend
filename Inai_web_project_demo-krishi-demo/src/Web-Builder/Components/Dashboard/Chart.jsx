import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import Header from "./Header";
import LeftSidebar from "./leftSidebar";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { FaUserCog } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

export default function Chart({username}) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    const handleToggleProfile = () => {
        setIsProfileOpen((prev) => !prev);
    };
    return (
        <div className="flex h-screen bg-[#050509] text-white">
            <div className="hidden md:block">
                <LeftSidebar />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    title="Monitoring"
                    onToggleSidebar={handleToggleSidebar}
                    onToggleProfile={handleToggleProfile}
                    isProfileOpen={isProfileOpen}
                    userName={username}
                    onCreditClick={() => navigate("/pricing")}
                />
                <main className="flex-1 overflow-y-auto app-background px-4 py-6 sm:px-8 sm:py-10">
                    <div className="mx-auto flex max-w-6xl flex-col gap-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h1 className="text-2xl font-semibold text-white sm:text-3xl">Web Analytics</h1>
                                <p className="mt-1 text-sm text-white/60">@ smit-bokha-seven-inky-52.vercel.app</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                                <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#101010] px-3 py-2 text-white/80">
                                    <span>Production</span>
                                    <span className="text-[10px] text-white/60 pt-1"><IoIosArrowDown /></span>
                                </button>
                                <button className="flex items-center rounded-xl border border-white/10 bg-[#101010] px-3 py-2 text-white/80">
                                    <SlCalender className="h-3.5 w-3.5" />
                                    <span className="mx-3 block h-6 w-px bg-white/15" />
                                    <span className="text-sm">Last 7 Days</span>
                                    <span className="ml-3 text-[10px] text-white/60 pt-1"><IoIosArrowDown /></span>
                                </button>
                                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#101010] text-white/70">
                                    <HiOutlineDotsHorizontal className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/5 bg-[#101010] px-4 py-4 sm:px-6 sm:py-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                                                Total Clients Admin
                                            </p>
                                            <p className="mt-3 text-2xl font-semibold text-white">50</p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#ffffff] text-[#101010]">
                                            <FaUserCog className="h-6 w-6 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#101010] via-[#141127] to-[#1B0E30] p-5 sm:p-7">
                            <div className="relative mt-4 h-64 w-full overflow-hidden rounded-2xl">
                                {/* Y-axis labels */}
                                <div className="pointer-events-none absolute left-4 top-6 flex h-[180px] flex-col justify-between text-[10px] text-white/60">
                                    <span>Nov 7</span>
                                    <span>Nov 8</span>
                                    <span>Nov 9</span>
                                    <span>Nov 10</span>
                                    <span>Nov 11</span>
                                </div>
                                {/* X-axis labels */}
                                <div className="pointer-events-none absolute inset-x-8 left-20 bottom-4 flex items-end justify-between text-[10px] text-white/60">
                                    <span>Nov 7</span>
                                    <span>Nov 8</span>
                                    <span>Nov 9</span>
                                    <span>Nov 10</span>
                                    <span>Nov 11</span>
                                    <span>Nov 12</span>
                                    <span>Nov 13</span>
                                    <span>Nov 14</span>
                                </div>
                                {/* Static line + area chart (can be wired to real data later) */}
                                <div className="absolute inset-x-8 bottom-10 top-4 left-20">
                                    <svg
                                        viewBox="0 0 90 40"
                                        className="h-full w-full"
                                        preserveAspectRatio="none"
                                    >
                                        <defs>
                                            <linearGradient id="trafficArea" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#FF9898" stopOpacity="0.35" />
                                                <stop offset="50%" stopColor="#C96CFF" stopOpacity="0.35" />
                                                <stop offset="100%" stopColor="#8054FF" stopOpacity="0.4" />
                                            </linearGradient>
                                            <linearGradient id="trafficLine" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#FF9898" />
                                                <stop offset="50%" stopColor="#E07BFF" />
                                                <stop offset="100%" stopColor="#8054FF" />
                                            </linearGradient>
                                        </defs>
                                        {/* Area under the line */}
                                        <path
                                            d="M0 30 L12.5 29 L25 27 L37.5 15 L50 8 L62.5 20 L75 25 L87.5 18 L100 10 L100 40 L0 40 Z"
                                            fill="url(#trafficArea)"
                                        />
                                        {/* Line */}
                                        <path
                                            d="M0 30 L12.5 29 L25 27 L37.5 15 L50 8 L62.5 20 L75 25 L87.5 18 L100 10"
                                            fill="none"
                                            stroke="url(#trafficLine)"
                                            strokeWidth="0.3"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 flex bg-black/60 md:hidden">
                    <div className="h-full w-72 max-w-[80vw]">
                        <LeftSidebar />
                    </div>
                    <div
                        className="flex-1"
                        onClick={() => {
                            setIsSidebarOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}