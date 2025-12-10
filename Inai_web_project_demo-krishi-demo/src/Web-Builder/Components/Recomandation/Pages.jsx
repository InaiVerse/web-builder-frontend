import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoWhite from '@/Web-Builder/assets/Logo-White.png';
import Cookies from "js-cookie";
import { getProjectData, setProjectData } from '../Utils/projectStorage';
import {
    FaHome, FaInfoCircle, FaServicestack, FaTags, FaPhone, FaLock, FaFileContract,
    FaBriefcase, FaComments, FaUserTie, FaStore, FaBoxOpen, FaShoppingCart,
    FaCreditCard, FaTruck
} from "react-icons/fa";

export default function Pages({ themeColors = [] }) {

    const username = Cookies.get("username") || "Guest";
    const [selectedCards, setSelectedCards] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    // Prevent refresh when navigating to builder
    const handleNavigateToBuilder = () => {
        // Save current scroll position
        sessionStorage.setItem('scrollPosition', window.scrollY);

        // Navigate without refresh
        navigate('/builder', {
            replace: true,
            state: { fromPages: true }
        });
    };

    const cardData = useMemo(
        () => [
            { id: 1, title: 'Home', description: 'Egestas tellus nunc proin amet.', icon: <FaHome size={28} /> },
            { id: 2, title: 'About Us', description: 'Egestas tellus nunc proin amet.', icon: <FaInfoCircle size={28} /> },
            { id: 3, title: 'Services', description: 'Egestas tellus nunc proin amet.', icon: <FaServicestack size={28} /> },
            { id: 4, title: 'Pricing', description: 'Egestas tellus nunc proin amet.', icon: <FaTags size={28} /> },
            { id: 5, title: 'Privacy Policy', description: 'Egestas tellus nunc proin amet.', icon: <FaLock size={28} /> },
            { id: 6, title: 'Terms & Condition', description: 'Egestas tellus nunc proin amet.', icon: <FaFileContract size={28} /> },
            { id: 7, title: 'Portfolio', description: 'Egestas tellus nunc proin amet.', icon: <FaBriefcase size={28} /> },
            { id: 8, title: 'Testimonials', description: 'Egestas tellus nunc proin amet.', icon: <FaComments size={28} /> },
        ],
        []
    );

    useEffect(() => {
        const stored = getProjectData();
        if (Array.isArray(stored.selectedPageIds)) {
            setSelectedCards(stored.selectedPageIds);
        }
    }, []);

    const persistSelection = (ids) => {
        const selectedPayload = cardData
            .filter(card => ids.includes(card.id))
            .map(({ id, title, description }) => ({ id, title, description }));

        setProjectData({
            selectedPageIds: ids,
            selectedPages: selectedPayload,
            themeColors,
            themeCompleted: !!themeColors.length
        });
    };

    const handleCardClick = (id) => {
        if (selectedCards.includes(id)) {
            const next = selectedCards.filter(cid => cid !== id);
            setSelectedCards(next);
            persistSelection(next);
            return;
        }

        const next = [...selectedCards, id];
        setSelectedCards(next);
        persistSelection(next);
    };

    const buildExportPayload = () => {
        const data = getProjectData();
        const metadataId = data.metadata_id || `metadata-${Date.now()}`;
        const questionsObj = Array.isArray(data.questions)
            ? data.questions.reduce((acc, q, idx) => {
                acc[`q${idx + 1}`] = {
                    question: q.text,
                    answer: data.answers?.[q.id] ?? '',
                    type: q.type,
                    options: q.options ?? null
                };
                return acc;
            }, {})
            : {};

        return {
            metadata_id: metadataId,
            generated_at: data.updatedAt || new Date().toISOString(),
            prompt: data.prompt || '',
            analysis: '',
            website_info: {
                business_type: data.answers?.business_type || '',
                style: data.answers?.style || '',
                color_preference: (data.themeColors || []).join(', '),
                tone: data.answers?.tone || '',
                pages_required: data.selectedPages?.map((p) => p.title) || [],
                features_required: data.selectedPages?.map((p) => p.title) || [],
                questions_answers: questionsObj
            },
            theme: {
                colors: data.themeColors || []
            },
            features: data.selectedPages?.map((page) => ({
                key: page.id,
                label: page.title,
                description: page.description,
                selected: true,
                category: page.category || 'Core Pages'
            })) || [],
            user_inputs: data.answers || {},
            interactions: data.interactions || []
        };
    };

    const handleSaveMetadata = async () => {
        if (isSaving) return;

        const payload = buildExportPayload();
        const prefilledPrompt = `Generate a complete multi-page website project using the following metadata. Preserve structure and cover all requested pages and features.\n${JSON.stringify(payload, null, 2)}`;

        setIsSaving(true);

        try {
            // ⭐ Call backend API to save metadata
            console.log('📤 Saving metadata to backend...', payload);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/save-metadata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to save metadata: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Metadata saved successfully:', result);

            // ⭐ Save metadata_id along with other data
            setProjectData({
                metadataPayload: payload,
                metadataId: result.metadata_id || payload.metadata_id, // Use returned ID or fallback
                builderPrefillPrompt: prefilledPrompt,
                lastPreparedAt: new Date().toISOString(),
            });

            console.log('🎯 Metadata ID saved:', result.metadata_id || payload.metadata_id);

            // Navigate to builder with prefilled data
            handleNavigateToBuilder();
        } catch (error) {
            console.error('❌ Metadata save error:', error);

            // ⭐ Graceful fallback: Save locally and allow navigation with warning
            const fallbackConfirm = window.confirm(
                `⚠️ Unable to save metadata to server: ${error.message}\n\n` +
                `You can continue, but website quality may be reduced.\n\n` +
                `Click OK to continue anyway, or Cancel to retry.`
            );

            if (fallbackConfirm) {
                console.warn('⚠️ Proceeding without backend metadata save');
                // Save to localStorage only
                setProjectData({
                    metadataPayload: payload,
                    metadataId: payload.metadata_id, // Use local ID
                    builderPrefillPrompt: prefilledPrompt,
                    lastPreparedAt: new Date().toISOString(),
                });
                handleNavigateToBuilder();
            }
        } finally {
            setIsSaving(false);
        }
    };

    const cards = useMemo(
        () => cardData.map((card) => ({ ...card, isSelected: selectedCards.includes(card.id) })),
        [selectedCards, cardData]
    );

    return (
        <div className="relative min-h-screen overflow-hidden app-background px-0 sm:px-10 md:px-16 pb-10">

            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2B1132] via-[#0F0C29] to-[#302B63]" />
            <div
                className="absolute inset-0 -z-10 opacity-60"
                style={{
                    background:
                        "radial-gradient(circle at 15% 15%, rgba(255, 177, 155, 0.4), transparent 55%), " +
                        "radial-gradient(circle at 80% 20%, rgba(129, 110, 254, 0.35), transparent 60%), " +
                        "radial-gradient(circle at 50% 90%, rgba(30, 70, 255, 0.25), transparent 65%)"
                }}
            />

            <div className="mx-auto max-w-6xl flex flex-col gap-4">

                {/* Header */}
                <header className="flex items-center justify-between py-7 px-4 sm:px-0">
                    <img src={LogoWhite} alt="Logo" className="h-10 sm:h-auto" />

                    <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] px-4 py-2 shadow-lg">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                            <span className="text-sm font-semibold cursor-pointer">{username?.[0]?.toUpperCase()}</span>
                        </span>
                        <div className="text-sm font-medium cursor-pointer">{username}</div>
                    </div>
                </header>

                {/* Title */}
                <main className="flex flex-col px-4 sm:px-0">
                    <h1 className="text-[26px] sm:text-[30px] font-semibold leading-tight">
                        Add{" "}
                        <span className="bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#60a5fa] bg-clip-text text-transparent">
                            Page
                        </span>{" "}
                        and{" "}
                        <span className="bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#60a5fa] bg-clip-text text-transparent">
                            Features
                        </span>
                    </h1>
                    <p className="mt-2 text-[13px] text-white/70 max-w-[400px]">
                        You’ll be able to customize these pages later.
                    </p>

                    {/* MOBILE LIST (full width stacked) */}
                    <section className="mt-6 grid grid-cols-1 gap-4 sm:hidden">

                        {cards.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(card.id)}
                                className={`
                                    w-full rounded-2xl p-4 text-left
                                    border border-white/15 bg-white/5
                                    shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                                    transition-all relative
                                    ${card.isSelected ? "border-[#d18bff] bg-[#14081f]/70" : ""}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="text-white">{card.icon}</div>

                                    <span
                                        className={`
                                            h-[22px] w-[22px] flex items-center justify-center 
                                            rounded-full border border-white/30
                                            ${card.isSelected ? "bg-gradient-to-r from-pink-400 to-purple-500 border-transparent" : ""}
                                        `}
                                    >
                                        {card.isSelected && (
                                            <span className="h-[10px] w-[10px] rounded-full bg-white" />
                                        )}
                                    </span>
                                </div>

                                <h3 className="mt-3 text-[18px] font-semibold text-white">{card.title}</h3>
                                <p className="text-[14px] text-white/60">{card.description}</p>
                            </button>
                        ))}
                    </section>

                    {/* DESKTOP GRID (unchanged) */}
                    <section
                        className="
                            mt-5 hidden sm:grid
                            gap-[10px]
                            grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
                            justify-items-start
                        "
                    >
                        {cards.map((card) => (
                            <button
                                key={card.id}
                                type="button"
                                onClick={() => handleCardClick(card.id)}
                                className={`
                                    w-[270px] group/card relative flex min-h-[160px] flex-col gap-[10px]
                                    rounded-[10px] border border-white/15 bg-[#11061d]/80 p-[15px]
                                    text-left text-white shadow-[0_12px_26px_rgba(8,2,18,0.32)]
                                    hover:-translate-y-0.5 hover:border-[rgba(255,186,235,0.35)]
                                    hover:shadow-[0_20px_44px_rgba(20,8,35,0.52)]
                                    transition-all
                                    ${card.isSelected
                                        ? "border-transparent bg-[linear-gradient(92deg,rgba(255,152,152,0.18),rgba(128,84,255,0.18))]"
                                        : ""
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="h-6 w-6 text-white">{card.icon}</div>

                                    <span
                                        className={`
                                            flex h-[22px] w-[22px] items-center justify-center 
                                            rounded-full border border-white/25 cursor-pointer
                                            ${card.isSelected
                                                ? "bg-gradient-to-r from-pink-400 to-purple-500 border-transparent"
                                                : ""
                                            }
                                        `}
                                    >
                                        {card.isSelected && (
                                            <span className="h-[10px] w-[10px] rounded-full bg-white" />
                                        )}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-[18px] font-semibold">{card.title}</h3>
                                    <p className="text-[14px] text-white/70">{card.description}</p>
                                </div>
                            </button>
                        ))}
                    </section>
                </main>

                {/* Footer */}
                <footer className="mt-10 flex w-full flex-col-reverse gap-4 text-sm sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
                    <div className="flex justify-end items-center w-full">
                        <button
                            type="button"
                            onClick={handleSaveMetadata}
                            disabled={isSaving}
                            className={`rounded-[8px] bg-white text-[#262626] px-6 py-3 font-medium cursor-pointer ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? 'Saving…' : 'Continue'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
