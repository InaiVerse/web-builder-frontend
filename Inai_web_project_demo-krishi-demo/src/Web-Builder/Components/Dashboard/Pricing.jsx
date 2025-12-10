import LeftSidebar from "./leftSidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import "../../../App.css";
import Cookies from "js-cookie";

export default function Pricing({ username }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleToggleProfile = () => {
        setIsProfileOpen((prev) => !prev);
    };
    const handleCreateProject = async () => {
        const token = Cookies.get("access_token");

        if (!token) {
            console.log("Token missing... redirecting to login");
            navigate("/signin");
            return;
        }

        try {
            const response = await fetch("http://192.168.1.70:4000/auth/project/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_name: "Untitled Project"
                }),
            });

            const result = await response.json();
            console.log("Project Create Response:", result);

            if (result.status === true) {
                navigate("/input");
            } else {
                alert(result.message || "Failed to create project");
            }
        } catch (error) {
            console.error("Project create error:", error);
        }
    };
    return (
        <div className="flex h-screen bg-[#050509] text-white">
            {/* Left sidebar */}
            <div className="hidden md:block">
                <LeftSidebar />
            </div>
            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    title="Pricing"
                    onToggleSidebar={handleToggleSidebar}
                    onToggleProfile={handleToggleProfile}
                    isProfileOpen={isProfileOpen}
                    onCreateProject={handleCreateProject}
                    userName={username}
                    onCreditClick={() => navigate("/pricing")}
                />
                {/* Pricing content */}
                <main className="flex-1 overflow-y-auto app-background px-4 py-6 sm:px-8 sm:py-10 ">
                    <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
                        {/* Sidebar for small screens */}
                        <div className="md:hidden">
                            <LeftSidebar />
                        </div>
                        {/* Cards */}
                        <div className="flex w-full flex-col gap-20 lg:flex-row">
                            {/* Basic */}
                            <PricingCard
                                label="Basic"
                                subtitle="Best for personal use."
                                price="Free"
                                features={[
                                    "Employee directory",
                                    "Task management",
                                    "Calendar integration",
                                    "File storage",
                                    "Communication tools",
                                    "Reporting and analytics",
                                ]}
                            />
                            {/* Pro (highlighted) */}
                            <PricingCard
                                label="Pro"
                                subtitle="For teams building and iterating on larger"
                                price="$20"
                                priceNote="per month"
                                highlighted
                                features={[
                                    "Everything in Basic",
                                    "Advanced task automation",
                                    "Priority support",
                                    "Team workspaces",
                                    "Advanced reporting",
                                ]}
                            />
                            {/* Enterprise */}
                            <PricingCard
                                label="Enterprise"
                                subtitle="More scale, control, and support"
                                price="Custom"
                                features={[
                                    "All features in Pro Plan",
                                    "Custom agent credits",
                                    "Custom spaces",
                                    "Custom user seats",
                                    "Shared custom instructions",
                                    "Unlimited activity history",
                                ]}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
function PricingCard({
    label,
    subtitle,
    price,
    priceNote,
    features,
    highlighted,
}) {
    const baseClasses =
        "pricing-card relative flex flex-1 flex-col justify-between rounded-[32px] bg-transparent px-6 py-6 sm:px-8 sm:py-8 text-sm text-white/80 transition-all duration-300 hover:-translate-y-1 min-h-[520px] lg:h-[570px]";
    const highlightRing =
        "border-white/10 hover:border-[#8054FF] hover:bg-transparent";
    return (
        <div className={`${baseClasses} ${highlightRing}`}>
            <div>
                {/* Top bullet + label block */}
                <div className="mb-6">
                    {/* Bullet icon */}
                    <div className="mb-3 flex items-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
                            <span className="h-2 w-2 rounded-full bg-white" />
                        </span>
                    </div>
                    {/* Label and subtitle stacked */}
                    <div className="space-y-1">
                        <div className="text-sm font-semibold text-white text-[24px]">{label}</div>
                        <div className="text-xs font-medium text-white/80 text-[13px]">{subtitle}</div>
                    </div>
                </div>
                <div className="mb-8 text-3xl font-semibold sm:text-4xl">
                    {price}
                    {priceNote ? (
                        <span className="ml-2 align-middle text-xs font-normal text-white/60">
                            {priceNote}
                        </span>
                    ) : null}
                </div>
                <button
                    className={`mb-8 w-full cursor-pointer rounded-[10px] px-4 py-2 text-sm font-semibold transition ${highlighted
                        ? "bg-gradient-to-r from-[#FF4B8B] to-[#9B5CFF] text-white "
                        : "bg-white/5 text-white/90 hover:bg-white/10"
                        }`}
                >
                    Get Started
                </button>
                {/* Divider above section title */}
                <div className="mb-12 h-px w-full bg-white/10" />
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                    What you will get
                </div>
                <ul className="space-y-2 text-xs text-white/70">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1 h-3 w-3 rounded-full border border-white/40" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}