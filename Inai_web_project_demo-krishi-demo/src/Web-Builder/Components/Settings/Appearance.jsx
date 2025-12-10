import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiGlobe, FiCheck } from "react-icons/fi";
import Header from "../Dashboard/Header";
import LeftSidebar from "../Dashboard/leftSidebar";

const tabs = [
    { label: "Profile", route: "/Profile" },
    { label: "Settings", route: "/Settings" },
    { label: "Appearance", route: "/Appearance" },
];

export default function Appearance({ userName }) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("dark");

    const location = useLocation();
    const navigate = useNavigate();


    const handleToggleSidebar = (event) => {
        if (event) event.stopPropagation();
        setIsSidebarOpen((prev) => !prev);
    };

    const handleToggleProfile = (event) => {
        if (event) event.stopPropagation();
        setIsProfileOpen((prev) => !prev);
    };

    // 🔥 PERFECT theme preview options
    const themeOptions = [
        {
            key: "dark",
            label: "Dark",
            helper: "Best for low-light environments.",
            icon: <FiMoon className="h-5 w-5" />,
            preview: {
                cardBackground:
                    "linear-gradient(135deg, rgba(255,152,152,0.1) 0%, rgba(128,84,255,0.1) 100%)",

                style: {
                    background: "linear-gradient(160deg, #0D0D12 0%, #111118 100%)",
                    border: "3px solid red",
                    borderImage:
                        "linear-gradient(135deg, rgba(255,152,152,0.3), rgba(128,84,255,0.3)) 1",
                },

                accent: "#B37CFF",
                text: "rgba(255,255,255,0.16)",
            }
        },
        {
            key: "light",
            label: "Light",
            helper: "Bright, crisp surfaces with high contrast.",
            icon: <FiSun className="h-5 w-5" />,
            preview: {
                cardBackground:
                    "linear-gradient(135deg, rgba(144,104,255,0.1) 0%, rgba(144,104,255,0.1) 100%)",
                style: {
                    background: "#FFFFFF",
                    border: "3px solid #E1E1E1"
                },
                accent: "#A575FF",
                text: "rgba(0,0,0,0.22)"
            }
        },
        {
            key: "system",
            label: "System",
            helper: "Follow your device appearance settings.",
            icon: <FiGlobe className="h-5 w-5" />,
            preview: {
                cardBackground:
                    "linear-gradient(135deg, rgba(25,22,34,0.1) 0%, rgba(14,13,22,0.1) 100%)",
                style: {
                    background:
                        "linear-gradient(90deg, #0A0A0A 0%, #1E1E1E 25%, #C0C0C0 75%, #FFFFFF 100%)",
                    border: "3px solid rgba(255,255,255,0.08)"
                },
                accent: "#A575FF",
                text: "rgba(0,0,0,0.30)"
            }
        }

    ];

    return (
        <div
            className="flex min-h-screen bg-[#05070a] text-gray-100"
            style={{ fontFamily: "Geist, sans-serif" }}
        >
            <div className="hidden lg:block">
                <LeftSidebar />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">

                <Header
                    title="Appearance"
                    onToggleSidebar={handleToggleSidebar}
                    onCreateProject={() => navigate("/input")}
                    onToggleProfile={handleToggleProfile}
                    isProfileOpen={isProfileOpen}
                    userName={userName}
                    showCreditButton={false}
                />

                <div className="flex flex-1 overflow-hidden border-t border-white/5">

                    <main
                        className="relative flex flex-1 overflow-y-auto transition origin-top"
                        style={{
                            background:
                                "radial-gradient(circle at 0% 18%, rgba(41,25,28,0.45), transparent 58%), radial-gradient(circle at 100% 82%, rgba(29,18,56,0.5), transparent 60%), linear-gradient(125deg, #29191c 0%, #010103 55%, #1d1238 100%)",
                        }}
                    >

                        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 md:px-8 lg:py-8 2xl:max-w-[104rem]">

                            {/* Header */}
                            <header className="space-y-2">
                                <h1 className="text-2xl font-semibold text-white lg:text-3xl">
                                    Settings
                                </h1>
                                <p className="text-md text-gray-500">
                                    Manage your account settings and preferences.
                                </p>
                            </header>

                            {/* Tabs */}
                            <div className="flex flex-wrap gap-2 font-semibold tracking-[0.3em] uppercase">
                                {tabs.map(({ label, route }) => {
                                    const isActive = location.pathname === route;
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => !isActive && navigate(route)}
                                            className={`flex h-[34px] w-[110px] items-center justify-center rounded-lg px-[28px] text-[0.72rem] transition ${isActive
                                                ? "bg-[linear-gradient(95deg,#FF9898_0%,#8054FF_100%)] text-white"
                                                : "border border-white/12 text-white/65 hover:text-white bg-[linear-gradient(95deg,rgba(31,31,40,0.8)_0%,rgba(18,18,26,0.8)_100%)]"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Theme Section */}
                            <section className="relative flex flex-col gap-8 rounded-2xl border border-white/10 bg-[#06060f]/70 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.45)] backdrop-blur">

                                <div className="space-y-3">
                                    <h2 className="text-[1.6rem] font-semibold text-white">Appearance</h2>
                                    <p className="text-[0.95rem] text-white/60">
                                        Customize how StuQuiz looks for you
                                    </p>
                                    <p className="pt-3 text-sm font-semibold tracking-[0.32em] text-white">
                                        Theme
                                    </p>
                                </div>

                                {/* Theme Cards */}
                                <div className="grid gap-6 lg:grid-cols-3">
                                    {themeOptions.map(({ key, label, helper, icon, preview }) => {
                                        const isActive = selectedTheme === key;

                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedTheme(key)}
                                                className={`relative rounded-3xl p-[2px] transition ${isActive
                                                    ? "shadow-[0_15px_45px_rgba(21,9,53,0.35)]"
                                                    : "hover:-translate-y-1"
                                                    }`}
                                                style={{
                                                    background: preview.cardBackground,
                                                }}
                                            >
                                                <div className="rounded-3xl bg-[#0d0c15]/40 p-6 backdrop-blur-xl border border-white/10">

                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <span className="inline-flex items-center gap-2 text-base font-semibold text-white">
                                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
                                                                {icon}
                                                            </span>
                                                            {label}
                                                        </span>

                                                        <FiCheck
                                                            className={`h-6 w-6 transition ${isActive
                                                                ? "text-white"
                                                                : "hidden"
                                                                }`}
                                                        />
                                                    </div>

                                                    {/* Preview box */}
                                                    <div
                                                        className="relative mt-4 rounded-2xl p-4"
                                                        style={preview.style}
                                                    >
                                                        <span
                                                            className="absolute inset-y-2 right-3 w-[3px]"
                                                            style={{
                                                                background: `linear-gradient(180deg, ${preview.accent} 0%, transparent 100%)`,
                                                            }}
                                                        />

                                                        <div className="flex flex-col gap-3 text-[0.7rem]">
                                                            <div
                                                                className="h-2.5 w-20 rounded-full"
                                                                style={{ background: preview.accent }}
                                                            />
                                                            <div
                                                                className="h-2 rounded-full"
                                                                style={{ background: preview.text }}
                                                            />
                                                            <div
                                                                className="h-2 w-3/5 rounded-full"
                                                                style={{ background: preview.text }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Helper Text */}
                                                    <p className="mt-4 text-sm text-white/70">{helper}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-6">
                                    <button
                                        type="button"
                                        className="rounded-full bg-[linear-gradient(120deg,#FF7BAC_0%,#7367FF_100%)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(115,103,255,0.45)]"
                                    >
                                        Save Appearance
                                    </button>
                                </div>
                            </section>
                        </div>
                    </main>

                    {isSidebarOpen && (
                        <div className="fixed inset-0 z-40 flex bg-black/60 lg:hidden">
                            <div className="h-full w-72 max-w-[80vw]">
                                <LeftSidebar onClose={() => setIsSidebarOpen(false)} />
                            </div>
                            <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
