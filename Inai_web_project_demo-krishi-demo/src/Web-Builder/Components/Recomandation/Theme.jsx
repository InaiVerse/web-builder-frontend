import { useEffect, useRef, useState } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import "../../../App.css";
import LogoWhite from '@/Web-Builder/assets/Logo-White.png';
import Pages from './Pages';
import Cookies from "js-cookie";
import { getProjectData, setProjectData } from '../Utils/projectStorage';

const PALETTE_GROUPS = [
  ["#EAB38D", "#B77AB0", "#7D8EDA", "#62BDD7", "#A8F5F1"],
  ["#5AD1A1", "#C7F464", "#F2E394", "#F1BF6B", "#F0765A"],
  ["#6BC5B1", "#4E9778", "#2F4A3E", "#F79F79", "#F7DAD9"],
  ["#FBC687", "#E09393", "#964F4C", "#4E5D6C", "#8EA3A9"],
  ["#4D5E7F", "#6B7BA8", "#8794C0", "#A3B0D8", "#E7EAF6"],
  ["#1B4F72", "#2874A6", "#7FB3D5", "#F5CBA7", "#DC7633"],
  ["#2C3E50", "#1ABC9C", "#F1C40F", "#F39C12", "#D35400"],
  ["#A8E6CF", "#DCEDC1", "#FFDEAD", "#FFAAA5", "#FF8B94"],
  ["#2B2E4A", "#903749", "#E84545", "#53354A", "#FFEA00"],
  ["#C9D6DF", "#E3E8EC", "#F6F7F8", "#52616B", "#354551"],
  ["#B6F7C1", "#81EAD8", "#4DD2FF", "#1A87FF", "#004CFF"],
  ["#FFE3A3", "#FFC078", "#FFA94D", "#FF922B", "#FF6B6B"],
  ["#EAB38D", "#B77AB0", "#7D8EDA", "#62BDD7", "#A8F5F1"],
  ["#5AD1A1", "#C7F464", "#F2E394", "#F1BF6B", "#F0765A"],
  ["#EAB38D", "#B77AB0", "#7D8EDA", "#62BDD7", "#A8F5F1"],
  ["#5AD1A1", "#C7F464", "#F2E394", "#F1BF6B", "#F0765A"],
  ["#EAB38D", "#B77AB0", "#7D8EDA", "#62BDD7", "#A8F5F1"],
  ["#5AD1A1", "#C7F464", "#F2E394", "#F1BF6B", "#F0765A"],
];

const MAX_COLORS = 4;
const limitColors = (colors) => colors.slice(0, MAX_COLORS);
const DEFAULT_CUSTOM_COLORS = limitColors(PALETTE_GROUPS[0]);

export default function Theme() {

  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState(DEFAULT_CUSTOM_COLORS);
  const [customColors, setCustomColors] = useState(DEFAULT_CUSTOM_COLORS);
  const [detectedColors, setDetectedColors] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const fileInputRef = useRef(null);
  const username = Cookies.get("username") || "Guest";

  const handleContinue = () => {
    setProjectData({ themeColors: selectedColors, themeCompleted: true });
    setIsCompleted(true);
  };

  useEffect(() => {
    const stored = getProjectData();
    if (typeof stored.selectedPaletteIndex === 'number') {
      setSelectedPaletteIndex(stored.selectedPaletteIndex);
    }
    if (stored.themeColors?.length) {
      const limited = limitColors(stored.themeColors);
      setSelectedColors(limited);
      setCustomColors(limitColors(stored.customColors || limited));
    }
    if (stored.detectedColors?.length) {
      setDetectedColors(stored.detectedColors);
    }
    if (stored.themeCompleted) {
      setIsCompleted(true);
    }
  }, []);

  if (isCompleted) return <Pages themeColors={selectedColors} />;

  const handlePaletteSelect = (index) => {
    const palette = limitColors(PALETTE_GROUPS[index]);
    setSelectedPaletteIndex(index);
    setSelectedColors(palette);
    setProjectData({ themeColors: palette, selectedPaletteIndex: index, customColors: palette });
  };

  const handleCustomColorChange = (index, val) => {
    const next = [...customColors];
    next[index] = val.toUpperCase();
    setCustomColors(next);
    setProjectData({ customColors: next });
  };

  const handleSaveCustom = () => {
    setSelectedPaletteIndex(null);
    const saved = limitColors(customColors);
    setSelectedColors(saved);
    setProjectData({ themeColors: saved, customColors });
  };

  const handleFileChange = () => { };

  return (
    <div className="relative min-h-screen overflow-hidden app-background px-0 pb-8 sm:px-10 md:px-16">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2B1132] via-[#0F0C29] to-[#302B63]" />
      <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(circle at 15% 15%, rgba(255,177,155,0.4), transparent 55%), radial-gradient(circle at 80% 20%, rgba(129,110,254,0.35), transparent 60%), radial-gradient(circle at 50% 90%, rgba(30,70,255,0.25), transparent 65%)" }} />

      <div className="mx-auto flex max-w-6xl flex-col gap-4">

        {/* DESKTOP HEADER (unchanged) */}
        <header className="hidden sm:flex items-center justify-between py-7">
          <img src={LogoWhite} alt="Logo" />
          <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] px-4 py-2 shadow-lg shadow-[#6f2bff40]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-semibold cursor-pointer">
                {username?.[0]?.toUpperCase()}
              </span>
            </span>
            <div className="text-sm font-medium cursor-pointer">{username}</div>
          </div>
        </header>

        {/* MOBILE HEADER */}
        <header className="flex sm:hidden items-center justify-between px-4 py-6">
          <img src={LogoWhite} alt="Logo" className="h-10" />
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] px-3 py-1.5 shadow-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-semibold">
                {username?.[0]?.toUpperCase()}
              </span>
            </span>
            <div className="text-xs font-medium">{username}</div>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">

          {/* LEFT — PALETTES */}
          <section className="flex flex-col w-full lg:w-2/3">

            <h2 className="text-center text-white font-semibold text-lg sm:text-xl">Choose A <span className="text-white/70">Color Palette</span></h2>

            {/* DESKTOP view unchanged — only mobile updated */}
            <div className="grid gap-4 mt-4 
              max-sm:grid-cols-2 max-sm:px-4 
              sm:grid-cols-2 
              lg:grid-cols-3">

              {PALETTE_GROUPS.map((colors, idx) => {
                const active = selectedPaletteIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handlePaletteSelect(idx)}
                    className={`palette-card px-3 pt-0 
                      ${active ? "palette-card--active" : ""} 
                      max-sm:border max-sm:border-white/10 max-sm:rounded-xl max-sm:bg-white/5 max-sm:p-4`}
                  >
                    <div className="flex items-center justify-center py-2">
                      {colors.slice(0, 4).map((c, i) => (
                        <span
                          key={i}
                          className={`inline-block h-10 w-10 rounded-full border border-white/15 ${i > 0 ? "-ml-3" : ""}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}

            </div>
          </section>

          {/* CENTER DIVIDER (desktop only) */}
          <div className="hidden lg:block w-px bg-white/10" />

          {/* CUSTOM COLORS — Full width on mobile */}
          <section className="flex flex-col w-full lg:w-1/3 max-sm:px-4">

            <h2 className="text-center text-white font-semibold text-lg sm:text-xl">Custom <span className="text-white/70">Color</span></h2>

            <div className="border border-white/10 rounded-2xl p-3 mt-4 shadow-lg">

              <div
                className="rounded-2xl border border-white/5 h-32 mb-4"
                style={{ background: `linear-gradient(135deg, ${selectedColors.join(", ")})` }}
              />

              <div className="space-y-3">
                {customColors.map((color, index) => (
                  <div key={index} className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 bg-white/5">
                    <span className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-full border border-white/15" style={{ backgroundColor: color }} />
                      <input type="color" value={color} onChange={(e) => handleCustomColorChange(index, e.target.value)} className="w-12 h-8 bg-transparent cursor-pointer" />
                    </span>
                    <span className="text-white/70">{color.toUpperCase()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4">
                <button onClick={handleSaveCustom} className="bg-white cursor-pointer text-black rounded-full px-4 py-2 font-medium">Save</button>
              </div>
            </div>
          </section>

          {/* CENTER DIVIDER (desktop only) */}
          <div className="hidden lg:block w-px bg-white/10" />

          {/* DETECT SECTION — Full width on mobile */}
          <section className="flex w-full flex-col gap-4 lg:w-1/3 lg:min-h-[20rem] max-sm:px-4">

            <header className="flex items-center justify-center gap-2 text-base text-white">
              <span className="font-semibold">Detect</span>
              <span className="font-medium text-white/70">From Logo</span>
            </header>

            <div className="flex flex-1 flex-col items-center justify-center gap-4 
      rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-white">

              <span className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10">
                <IoCloudUploadSharp className="h-24 w-24" />
              </span>

              <p className="font-medium">Upload</p>
              <p className="text-sm text-white/60">Drop or browse logo to extract colors</p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
                >
                  Browse Files
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {detectedColors.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {detectedColors.map((color, index) => (
                    <span
                      key={`${color}-${index}`}
                      className="flex h-12 w-12 items-center justify-center 
            rounded-full border border-white/20 text-xs text-white/80"
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              )}

            </div>

          </section>


        </div>

        {/* FOOTER */}
        <footer className="flex flex-col sm:flex-row sm:justify-between mt-10 px-4 sm:px-0">
          <button className="text-white/70 py-2 cursor-pointer">Skip</button>
          <button onClick={handleContinue} className="bg-white cursor-pointer text-black rounded-lg px-6 py-2 mt-3 sm:mt-0">Continue</button>
        </footer>

      </div>
    </div>
  );
}
