import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Header from "../Dashboard/Header";
import LeftSidebar from "../Dashboard/leftSidebar";
const tabs = [
    { label: "Profile", route: "/Profile" },
    { label: "Settings", route: "/Settings" },
    { label: "Appearance", route: "/Appearance" },
];
export default function Settings({ userName }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const handleToggleSidebar = (event) => {
        if (event) {
            event.stopPropagation();
        }
        setIsSidebarOpen((prev) => !prev);
    };
    const handleToggleProfile = (event) => {
        if (event) {
            event.stopPropagation();
        }
        setIsProfileOpen((prev) => !prev);
    };
    const handlePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    const handlePasswordChange = (field) => (event) => {
        const { value } = event.target;
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const sharedLabelClass = "block text-sm font-medium  tracking-[0.28em] text-white/70";
    const sharedInputClass = "w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-[#A571FF] focus:outline-none focus:ring-2 focus:ring-[#A571FF]/40";
    const toggleIconClass = "absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/50 transition hover:text-white";
    return (
        <div
            className="flex min-h-screen bg-[#05070a] text-gray-100"
            style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "1",
                letterSpacing: "0",
            }}
        >
            <div className="hidden lg:block">
                <LeftSidebar />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    title="Settings"
                    onToggleSidebar={handleToggleSidebar}
                    onCreateProject={() => navigate("/input")}
                    onToggleProfile={handleToggleProfile}
                    isProfileOpen={isProfileOpen}
                    userName={userName}
                    showCreditButton={false}
                />
                <div className="flex flex-1 overflow-hidden border-t border-white/5">
                    <main
                        className="relative flex flex-1 overflow-y-auto transition-[background-color] duration-300 lg:overflow-y-auto"
                        style={{
                            background:
                                "radial-gradient(circle at 0% 18%, rgba(41,25,28,0.45), transparent 58%), radial-gradient(circle at 100% 82%, rgba(29,18,56,0.5), transparent 60%), linear-gradient(125deg, #29191c 0%, #010103 55%, #1d1238 100%)",
                        }}
                    >
                        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-5 md:px-6 lg:px-8 lg:py-6 xl:max-w-[82rem] xl:gap-7 2xl:max-w-[104rem]">
                            <header className="space-y-2">
                                <h1 className="text-2xl font-semibold text-white lg:text-3xl">Settings</h1>
                                <p className="text-sm text-gray-500">
                                    Manage your account settings and preferences.
                                </p>
                            </header>
                            <div className="flex w-full flex-1 flex-col gap-6 lg:min-h-0">
                                <div className="flex w-full max-w-5xl flex-wrap items-center gap-2 font-semibold uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(9,0,28,0.4)] backdrop-blur 2xl:max-w-[66rem]">
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
                                <section className="relative flex flex-1 min-h-0 flex-col overflow-y-auto rounded-[10px] border border-white/[0.05] bg-transparent px-6 py-6 shadow-[0_48px_110px_rgba(0,0,0,0.55)] backdrop-blur lg:px-16 lg:py-8 2xl:px-20">
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.015),transparent_55%),radial-gradient(circle_at_84%_88%,rgba(110,55,220,0.12),transparent_60%),radial-gradient(circle_at_14%_82%,rgba(255,118,180,0.12),transparent_65%)] opacity-90" />
                                    <div className="relative flex flex-1 flex-col gap-7 lg:gap-8">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold text-white lg:text-2xl">
                                                Account Security
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                Update your password and security settings.
                                            </p>
                                        </div>
                                        <div className="flex flex-1 flex-col gap-6">
                                            <div className="grid gap-6">
                                                <div className="space-y-2">
                                                    <label htmlFor="currentPassword" className={sharedLabelClass}>
                                                        Current Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            id="currentPassword"
                                                            type={passwordVisibility.currentPassword ? "text" : "password"}
                                                            value={passwordData.currentPassword}
                                                            onChange={handlePasswordChange("currentPassword")}
                                                            placeholder="Current Password"
                                                            className={sharedInputClass}
                                                        />
                                                        <button
                                                            type="button"
                                                            className={toggleIconClass}
                                                            onClick={() => handlePasswordVisibility("currentPassword")}
                                                        >
                                                            {passwordVisibility.currentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="newPassword" className={sharedLabelClass}>
                                                        New Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            id="newPassword"
                                                            type={passwordVisibility.newPassword ? "text" : "password"}
                                                            value={passwordData.newPassword}
                                                            onChange={handlePasswordChange("newPassword")}
                                                            placeholder="New Password"
                                                            className={sharedInputClass}
                                                        />
                                                        <button
                                                            type="button"
                                                            className={toggleIconClass}
                                                            onClick={() => handlePasswordVisibility("newPassword")}
                                                        >
                                                            {passwordVisibility.newPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="confirmPassword" className={sharedLabelClass}>
                                                        Confirm New Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            id="confirmPassword"
                                                            type={passwordVisibility.confirmPassword ? "text" : "password"}
                                                            value={passwordData.confirmPassword}
                                                            onChange={handlePasswordChange("confirmPassword")}
                                                            placeholder="Confirm New Password"
                                                            className={sharedInputClass}
                                                        />
                                                        <button
                                                            type="button"
                                                            className={toggleIconClass}
                                                            onClick={() => handlePasswordVisibility("confirmPassword")}
                                                        >
                                                            {passwordVisibility.confirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FF7BAC] to-[#905CFF] px-6 py-3 text-sm font-semibold text-white transition hover:shadow-[0_26px_70px_rgba(144,92,255,0.55)] focus:outline-none focus:ring-2 focus:ring-white/25"
                                                >
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </main>
                    {isSidebarOpen ? (
                        <div className="fixed inset-0 z-40 flex bg-black/60 lg:hidden">
                            <div className="h-full w-72 max-w-[80vw]">
                                <LeftSidebar onClose={() => setIsSidebarOpen(false)} />
                            </div>
                            <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
