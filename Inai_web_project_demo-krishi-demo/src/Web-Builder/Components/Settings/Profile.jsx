import { useEffect, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Dashboard/Header";
import LeftSidebar from "../Dashboard/leftSidebar";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import ReactCountryFlag from "react-country-flag";

const tabs = [
    { label: "Profile", route: "/Profile" },
    { label: "Settings", route: "/Settings" },
    { label: "Appearance", route: "/Appearance" },
];

export default function ProfileSettings({userName}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Profile");
    const [formData, setFormData] = useState({
        spaceName: "",
        firstName: "",
        userName: "",
        email: "",
        phoneNumber: "",
        description: "",
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

    const handleCreateProject = () => {
        // Placeholder for create project flow
        console.log("Trigger new project from profile settings");
    };

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };

        if (showCountryDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCountryDropdown]);

    const [selectedCountry, setSelectedCountry] = useState({
        code: "IN",
        name: "India"
    });

    const countries = [
        { code: "IN", name: "India" },
        { code: "US", name: "United States" },
        { code: "GB", name: "United Kingdom" },
        { code: "CA", name: "Canada" },
        { code: "AU", name: "Australia" },
        { code: "DE", name: "Germany" },
        { code: "FR", name: "France" },
        { code: "JP", name: "Japan" },
        { code: "CN", name: "China" },
        { code: "BR", name: "Brazil" }
    ];

    const sharedLabelClass = "block text-sm font-normal text-gray-300 mb-1";

    const handleFieldChange = (field) => (event) => {
        const { value } = event.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

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
                    title="Profile"
                    onToggleSidebar={handleToggleSidebar}
                    onCreateProject={handleCreateProject}
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
                                <div className="flex w-full max-w-5xl flex-wrap items-center gap-2  font-semibold uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(9,0,28,0.4)] backdrop-blur 2xl:max-w-[66rem]">
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

                                <section className="relative flex flex-1 min-h-0 flex-col overflow-hidden rounded-[10px] border border-white/[0.05] bg-transparent px-6 py-6 shadow-[0_48px_110px_rgba(0,0,0,0.55)] backdrop-blur lg:px-16 lg:py-8 2xl:px-20">
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.015),transparent_55%),radial-gradient(circle_at_82%_88%,rgba(110,55,220,0.1),transparent_60%),radial-gradient(circle_at_12%_85%,rgba(255,118,180,0.1),transparent_65%)] opacity-90" />
                                    <div className="relative flex flex-1 flex-col gap-6 lg:gap-7">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold text-white lg:text-2xl">
                                                Profile Information
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Update your profile information and public details.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                                            <div className="flex flex-col items-center gap-3 text-center lg:pt-2">
                                                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white text-2xl font-semibold text-[#12111d] shadow-[0_10px_25px_rgba(0,0,0,0.3)]">

                                                </div>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
                                                >
                                                    <MdOutlineFileUpload size={20} />
                                                    Change Photo
                                                </button>
                                            </div>

                                            <div className="flex flex-1 flex-col gap-5 text-sm">
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="spaceName" className={sharedLabelClass}>
                                                        Space Name
                                                    </label>
                                                    <input
                                                        id="spaceName"
                                                        type="text"
                                                        value={formData.spaceName}
                                                        onChange={handleFieldChange("spaceName")}
                                                        placeholder="Space Name"
                                                        className="w-full rounded-xl border border-white/[0.06] bg-[#FFFFFF0A] px-4 py-3 text-sm text-white placeholder:text-gray-400 transition focus:border-[#9b6cff] focus:outline-none focus:ring-2 focus:ring-[#9b6cff]/40"
                                                    />
                                                </div>

                                                <div className="grid gap-5 md:grid-cols-2">
                                                    <div className="flex flex-col gap-3">
                                                        <label htmlFor="firstName" className={sharedLabelClass}>
                                                            First Name
                                                        </label>
                                                        <input
                                                            id="firstName"
                                                            type="text"
                                                            value={formData.firstName}
                                                            onChange={handleFieldChange("firstName")}
                                                            placeholder="First Name"
                                                            className="w-full rounded-xl border border-white/[0.06] bg-[#FFFFFF0A] px-4 py-3 text-sm text-white placeholder:text-gray-400 transition focus:border-[#9b6cff] focus:outline-none focus:ring-2 focus:ring-[#9b6cff]/40"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label htmlFor="userName" className={sharedLabelClass}>
                                                            User Name
                                                        </label>
                                                        <input
                                                            id="userName"
                                                            type="text"
                                                            value={formData.userName}
                                                            onChange={handleFieldChange("userName")}
                                                            placeholder="User Name"
                                                            className="w-full rounded-xl border border-white/[0.06] bg-[#FFFFFF0A] px-4 py-3 text-sm text-white placeholder:text-gray-400 transition focus:border-[#9b6cff] focus:outline-none focus:ring-2 focus:ring-[#9b6cff]/40"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label htmlFor="email" className={sharedLabelClass}>
                                                            Email
                                                        </label>
                                                        <input
                                                            id="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={handleFieldChange("email")}
                                                            placeholder="Email"
                                                            className="w-full rounded-xl border border-white/[0.06] bg-[#FFFFFF0A] px-4 py-3 text-sm text-white placeholder:text-gray-400 transition focus:border-[#9b6cff] focus:outline-none focus:ring-2 focus:ring-[#9b6cff]/40"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label htmlFor="phoneNumber" className={sharedLabelClass}>
                                                            Phone Number
                                                        </label>
                                                        <div className="flex items-stretch" ref={dropdownRef}>
                                                            <div className="relative shrink-0 w-28">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                                    className="flex h-[42px] w-[80px] items-center justify-between rounded-lg border border-white/[0.06] bg-[#FFFFFF0A] px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                                                                >
                                                                    <div className="flex items-center">
                                                                        <span className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full overflow-hidden">
                                                                            <ReactCountryFlag
                                                                                countryCode={selectedCountry.code}
                                                                                svg
                                                                                style={{ display: "block", width: "100%", height: "100%" }}
                                                                            />
                                                                        </span>
                                                                        <span className="text-sm">{selectedCountry.dialCode}</span>
                                                                    </div>
                                                                    <FaChevronDown className="ml-2 h-3 w-3 text-gray-400" />
                                                                </button>

                                                                {showCountryDropdown ? (
                                                                    <div className="absolute z-10 mt-1 w-64 max-h-60 overflow-auto rounded-lg border border-white/[0.05] bg-[#131022]/90 shadow-[0_20px_45px_rgba(0,0,0,0.55)]">
                                                                        {countries.map((country) => (
                                                                            <button
                                                                                type="button"
                                                                                key={country.code}
                                                                                onClick={() => {
                                                                                    setSelectedCountry(country);
                                                                                    setShowCountryDropdown(false);
                                                                                }}
                                                                                className={`flex w-full items-center px-4 py-2 text-left text-sm transition hover:bg-white/5 ${selectedCountry.code === country.code ? "bg-purple-500/25 text-white" : "text-white/85"
                                                                                    }`}
                                                                            >
                                                                                <span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-full overflow-hidden">
                                                                                    <ReactCountryFlag
                                                                                        countryCode={country.code}
                                                                                        svg
                                                                                        style={{ display: "block", width: "120%", height: "120%" }}
                                                                                    />
                                                                                </span>
                                                                                <span>{country.name}</span>
                                                                                <span className="ml-auto text-gray-300">{country.dialCode}</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            <div className="flex-1">
                                                                <input
                                                                    id="phoneNumber"
                                                                    type="tel"
                                                                    value={formData.phoneNumber}
                                                                    onChange={handleFieldChange("phoneNumber")}
                                                                    className="h-[42px] w-full rounded-lg border border-white/[0.06] bg-[#FFFFFF0A] px-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                    placeholder="00000-00000"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3 md:col-span-2">
                                                        <label htmlFor="description" className={sharedLabelClass}>
                                                            Description
                                                        </label>
                                                        <textarea
                                                            id="description"
                                                            rows={3}
                                                            value={formData.description}
                                                            onChange={handleFieldChange("description")}
                                                            placeholder="A brief description of your space"
                                                            className="w-full resize-none rounded-xl border border-white/[0.06] bg-[#FFFFFF0A] px-4 py-3 text-sm text-white placeholder:text-gray-400 transition focus:border-[#9b6cff] focus:outline-none focus:ring-2 focus:ring-[#9b6cff]/40"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-1">
                                            <button
                                                type="button"
                                                className="w-full rounded-full bg-gradient-to-r from-[#FF7BAC] to-[#905CFF] px-7 py-3 text-sm font-semibold text-white  transition hover:shadow-[0_26px_70px_rgba(144,92,255,0.55)] focus:outline-none focus:ring-2 focus:ring-white/25 sm:w-auto"
                                            >
                                                Save Changes
                                            </button>
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
