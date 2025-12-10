// import { useState, useEffect, useRef } from 'react';

// import { useNavigate } from 'react-router-dom';

// import AOS from 'aos';
// import 'aos/dist/aos.css';

// import LogoWhite from '@/Web-Builder/assets/logo-white.png';
// import INAI from '@/Web-Builder/assets/INAI.png';
// import InaiArrow from '@/Web-Builder/assets/InaiArrow.png';
// import VideoInai from '@/Web-Builder/assets/VideoInai.mp4';
// import Template1 from '@/Web-Builder/assets/Template1.jpg';
// import Template2 from '@/Web-Builder/assets/Template2.jpg';
// import Template3 from '@/Web-Builder/assets/Template3.jpg';
// import Template4 from '@/Web-Builder/assets/Template4.jpg';
// import Cookies from "js-cookie";
// import { CgProfile } from 'react-icons/cg';


// const Nav = ({ goDashboard, goSignIn, goSignUp }) => {

//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const t = Cookies.get("access_token");
//     const username = Cookies.get("username");

//     setToken(t);
//     setUser(username ? { username } : null);
//   }, []);

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-transparent ">
//       <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

//         {/* LOGO */}
//         <div className="flex flex-col leading-tight">
//           <img src={LogoWhite} alt="" className="h-15 w-25" />
//         </div>

//         {/* MOBILE */}
//         <button
//           className="md:hidden text-white text-3xl pr-2"
//           onClick={!token ? goSignUp : goDashboard}
//         >
//           &#9776;
//         </button>

//         {/* DESKTOP */}
//         <div className="hidden md:flex items-center gap-4">
//           {!token ? (
//             <>
//               <button className="px-3 py-1 text-sm cursor-pointer" onClick={goSignIn}>
//                 Sign In
//               </button>

//               <button
//                 className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 cursor-pointer"
//                 onClick={goSignUp}
//               >
//                 Get Started
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 // onClick={handleProfileClick}
//                 className="flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-xs font-semibold text-white transition hover:text-gray-200 sm:h-10 sm:px-5 sm:text-sm"
//                 style={{
//                   borderRadius: "9999px",
//                   backgroundImage:
//                     "linear-gradient(#101010, #101010), linear-gradient(92deg, #FF7BAC 0%, #905CFF 100%)",
//                   backgroundOrigin: "border-box",
//                   backgroundClip: "padding-box, border-box",
//                   border: "1px solid transparent",
//                 }}
//               >
//                 <CgProfile className="h-5 w-5" />
//                 <span>{user?.username}</span>
//               </button>

//               <button
//                 className="px-5 py-2 cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold inline-flex items-center gap-2 hover:scale-105 transition"
//                 onClick={goDashboard}
//               >
//                 Start Here
//                 <svg
//                   viewBox="0 0 24 24"
//                   className="h-5 w-5"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M7 17L17 7" />
//                   <path d="M9 7h8v8" />
//                 </svg>
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };







// const VideoSection = () => (
//   <section className="relative py-12">
//     <div className="mx-auto max-w-7xl px-4">
//       <div className="rounded-2xl ring-0 overflow-hidden bg-black/40 shadow-2xl">
//         <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           preload="auto"
//           className="w-full h-auto aspect-[16/7] object-cover"
//         >
//           <source src={VideoInai} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     </div>
//   </section>
// );

// const Statement = () => (
//   <section className="py-14">
//     <div className="mx-auto max-w-4xl px-4 text-center">
//       <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
//         Imagine a vast collection of{' '}
//         <span className="relative inline-block">
//           <span className="relative z-10">business</span>
//           <span className="absolute inset-x-0 -inset-y-1.5 rounded bg-gradient-to-r from-pink-400/70 to-violet-600/70 blur-[1px] -z-0" />
//         </span>
//         <br />apps at your disposal.
//       </h2>
//       <p className="mt-4 text-white/70 text-lg">
//         Lorem ipsum dolor sit amet consectetur. Rhoncus eu elit at varius a gravida ullamcorper in tellus. Magna facilisis viverra tellus facilisis eu libero odio interdum. Eget phasellus amet sed consequat dictumst egestas quam.
//       </p>
//     </div>
//   </section>
// );

// const Hero = () => {
//   const navigate = useNavigate();
//   const token = Cookies.get("accessToken");

//   const goDashboard = () => navigate("/dashboard");
//   const goToSignIn = () => navigate("/signin");   // for SIGN IN only
//   const goToSignUp = () => navigate("/signup");   // for GET STARTED only


//   const goToSignupOrDashboard = () => {
//     if (token) return goDashboard();
//     return goToSignUp();
//   };


//   return (
//     <section className="relative">
//       <div className="pointer-events-none absolute inset-x-0 top-20 bottom-0 bg-gradient-to-b from-[#1a1224]/60 via-transparent to-transparent" />

//       <Nav
//         goDashboard={goDashboard}
//         goSignIn={goToSignIn}
//         goSignUp={goToSignUp}
//       />
//       <div className="relative mx-auto max-w-7xl px-4 mt-20 pt-10 pb-8">
//         <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 md:p-10 overflow-hidden backdrop-blur-md shadow-2xl">
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-600/20" />

//           <div className="pointer-events-none absolute inset-0">
//             <span
//               className="select-none font-extrabold tracking-tighter
//                 text-[60px] md:text-[96px] lg:text-[128px]
//                 leading-none text-white/10
//                 ml-20 md:ml-40 lg:ml-64
//                 [filter:blur(1px)]"
//               style={{
//                 maskImage:
//                   "linear-gradient(to top, transparent 12%, black 55%, black 90%)",
//               }}
//             >
//               INAI VERSE
//             </span>
//           </div>

//           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
//                 JOIN TODAY
//               </div>

//               <h1 className="mt-4 text-2xl md:text-4xl lg:text-6xl font-extrabold tracking-tight">
//                 Empower your business<br />growth with AI technologies<br />today.
//               </h1>

//               <p className="mt-4 max-w-xl text-white/70">
//                 Lorem ipsum dolor sit amet consectetur. Molestie volutpat
//                 facilisi pharetra sociis dolor. Lectus turpis adipiscing dolor
//                 nunc. Auctor nisl purus.
//               </p>

//               <div className="mt-6 flex items-center">
//                 <div className="relative inline-block">
//                   <button
//                     type="button"
//                     onClick={goToSignupOrDashboard}
//                     className="px-6 py-3.5 cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold inline-flex items-center gap-2 hover:scale-105 transition"
//                   >
//                     Get Started Today
//                     <svg
//                       viewBox="0 0 24 24"
//                       className="h-5 w-5"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path d="M7 17L17 7" />
//                       <path d="M9 7h8v8" />
//                     </svg>
//                   </button>

//                   <img
//                     src={InaiArrow}
//                     alt=""
//                     className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-20 opacity-90"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div>
//               <img src={INAI} alt="" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };


// const Templates = () => {
//   const cards = [
//     { id: 1, title: 'Analytics Dashboard', img: Template1 },
//     { id: 2, title: 'E-Commerce Platform', img: Template2 },
//     { id: 3, title: 'CRM System', img: Template3 },
//     { id: 4, title: 'AI Chatbot Pro', img: Template4 },
//   ];

//   const baseSpeed = 1.15;

//   const marqueeRef = useRef(null);
//   const speedRef = useRef(baseSpeed);
//   const targetSpeedRef = useRef(baseSpeed);

//   useEffect(() => {
//     const animate = () => {
//       const container = marqueeRef.current;
//       if (!container) {
//         animationFrame = requestAnimationFrame(animate);
//         return;
//       }

//       speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;

//       container.scrollLeft += speedRef.current;

//       const maxScroll = container.scrollWidth / 2;
//       if (maxScroll > 0 && container.scrollLeft >= maxScroll) {
//         container.scrollLeft -= maxScroll;
//       }

//       animationFrame = requestAnimationFrame(animate);
//     };

//     let animationFrame = requestAnimationFrame(animate);

//     return () => {
//       cancelAnimationFrame(animationFrame);
//     };
//   }, []);

//   const stopScroll = () => {
//     targetSpeedRef.current = 0;
//     speedRef.current = 0;
//   };

//   const resumeScroll = () => {
//     targetSpeedRef.current = baseSpeed;
//     speedRef.current = baseSpeed;
//   };

//   const marqueeItems = [...cards, ...cards];

//   return (
//     <section id="templates" className="relative py-14">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="flex items-center justify-center">
//           <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">Get to Know Us</div>
//         </div>
//         <div className="mt-4 flex items-center justify-center gap-8">
//           <button className="h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition">
//             <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
//           </button>
//           <h2 className="text-center text-3xl md:text-4xl font-extrabold">Templates</h2>
//           <button className="h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition">
//             <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
//           </button>
//         </div>
//         <div className="mt-8">
//           <div
//             ref={marqueeRef}
//             className="scrollbar-hide overflow-x-scroll overflow-y-visible w-full"
//             onMouseLeave={resumeScroll}
//           >

//             <div className="flex gap-6 w-max pr-6">
//               {marqueeItems.map((c, idx) => (
//                 <div
//                   key={`${c.id}-${idx}`}
//                   className="w-80 shrink-0 rounded-xl bg-white/5 ring-1 ring-white/10 p-4 shadow-xl hover:shadow-2xl transition-transform duration-300 hover:scale-[1.08]"
//                   onMouseEnter={stopScroll}
//                 >
//                   <img src={c.img} alt={c.title} className="rounded-lg aspect-[4/3] w-full h-auto object-cover" />
//                   <div className="mt-3 text-sm text-white/80">{c.title}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const HowItWorks = ({ onSignup }) => {
//   const steps = [1, 2, 3, 4, 5, 6].map((n) => ({
//     title: `Step ${n} – Setup & Integration`,
//     text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et netus. Aenean convallis at.',
//     n,
//   }));

//   return (
//     <section id="how" className="relative py-16">
//       <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-[1.2fr_1fr] gap-8">
//         <div className="space-y-4">
//           {steps.map((s) => (
//             <div
//               key={s.n}
//               className="relative rounded-xl bg-white/5 ring-1 ring-white/10 p-6 flex items-start justify-between gap-16 backdrop-blur"
//               data-aos="fade-up"
//               data-aos-anchor-placement="bottom-bottom"
//               data-aos-delay={(s.n - 1) * 100}
//             >
//               <div>
//                 <h4 className="font-semibold text-xl">{s.title}</h4>
//                 <p className="mt-1 text-sm text-white/70">{s.text}</p>
//               </div>
//               <div className="text-5xl font-extrabold bg-gradient-to-b from-pink-400 to-violet-600 text-transparent bg-clip-text">
//                 {String(s.n).padStart(2, '0 ')}
//               </div>
//             </div>
//           ))}
//         </div>
//         <div
//           className="p-8 bg-transparent"
//           data-aos="fade-down-left"
//           data-aos-anchor-placement="top-center"
//           data-aos-delay="150"
//         >
//           <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">How it Works</div>
//           <h3 className="mt-4 text-4xl font-extrabold leading-tight">Simple Steps to<br />Get Started</h3>
//           <p className="mt-3 text-white/70">Lorem ipsum dolor sit amet consectetur. Ultricies iaculis massa vel egestas.</p>
//           <div className="mt-8 flex items-center">
//             <div className="relative inline-block">
//               <button
//                 type="button"
//                 onClick={onSignup}
//                 className="px-6 py-3.5 cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-medium inline-flex items-center gap-2 hover:scale-105 transition"
//               >
//                 Get Started Today
//               </button>
//               <img
//                 src={InaiArrow}
//                 alt=""
//                 className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-20 opacity-90"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const Features = () => (
//   <section id="features" className="relative py-16">
//     <div className="mx-auto max-w-7xl px-4">
//       <div className="flex items-center justify-center">
//         <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs w-max">Get to Know Us</div>
//       </div>
//       <h2 className="mt-3 text-center text-5xl md:text-6xl font-extrabold">
//         Enterprise{' '}
//         <span className="relative inline-flex items-center justify-center align-middle px-6 py-2">
//           <span className="relative z-10 px-5 py-2 leading-none text-white">software</span>
//           <svg className="absolute -z-0 inset-[-4px] h-[calc(100%+8px)] w-[calc(100%+8px)]" viewBox="0 0 100 36" preserveAspectRatio="none">
//             <path d="M5,18 C8,8 28,2 45,6 C62,10 76,8 90,12 C98,15 98,22 90,26 C76,32 58,34 40,30 C26,27 12,28 6,24 C2,22 2,20 5,18 Z"
//               fill="url(#grad)" stroke="none" />
//             <defs>
//               <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#ec4899" />
//                 <stop offset="100%" stopColor="#7c3aed" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </span>
//         <br />done right.
//       </h2>
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[
//           {
//             title: 'AI Virtual GPT Model (INAI)',
//             body: 'Deploy our flagship conversational AI with enterprise SSO, knowledge syncing, and continuous fine-tuning for every client-facing workflow.',
//             spanLarge: true,
//             animation: 'fade-down-right',
//           },
//           {
//             title: 'Predictive Analytics Studio',
//             body: 'Forecast revenue, churn, and inventory with drag-and-drop pipelines powered by automated feature engineering and explainable ML.',
//           },
//           {
//             title: 'Workflow Automation Hub',
//             body: 'Design multi-step automations that connect your CRM, helpdesk, and billing tools with human-in-the-loop approvals built in.',
//             animation: 'fade-right',
//           },
//           {
//             title: 'Realtime Collaboration Canvas',
//             body: 'Collaborate with stakeholders in shared canvases featuring AI co-authoring, live comments, and secure audit trails.',
//             animation: 'flip-left',
//           },
//           {
//             title: 'Security & Compliance Suite',
//             body: 'Monitor policies, generate evidence, and ship SOC2-ready reports with automated alerts and remediation suggestions.',
//             animation: 'fade-left',
//           },
//         ].map(({ title, body, spanLarge, animation }) => {
//           const dataAos = animation ?? (spanLarge ? 'fade-down-right' : 'fade-down-left');
//           return (
//             <div
//               key={title}
//               className={`rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 ${spanLarge ? 'lg:col-span-2' : ''}`}
//               {...(dataAos ? { 'data-aos': dataAos } : {})}
//             >
//               <h4 className="font-bold text-xl">{title}</h4>
//               <p className="mt-2 text-sm text-white/70">{body}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   </section>
// );

// const FAQ = () => {
//   const items = [
//     {
//       question: 'How can I contact Inai Team?',
//       answer: 'Reach out via hello@inai.com, start a chat in the dashboard, or call +91-98765-43210 for priority support.',
//     },
//     {
//       question: 'What services do you offer?',
//       answer: 'We deliver AI product consulting, full-stack development, UI/UX design, and managed cloud deployment tailored to your roadmap.',
//     },
//     {
//       question: 'Do you provide website maintenance services?',
//       answer: 'Yes. Choose from monthly or quarterly maintenance plans covering updates, backups, performance tuning, and security monitoring.',
//     },
//     {
//       question: 'How long does it take to design and develop a website?',
//       answer: 'Timelines range from 4–6 weeks for landing pages to 10–12 weeks for complex platforms, depending on scope and integrations.',
//     },
//     {
//       question: 'Do you require a deposit for projects?',
//       answer: 'We begin once a 30% project deposit is received, with the remaining milestones tied to design sign-off and final delivery.',
//     },
//   ];

//   const [open, setOpen] = useState(-1);
//   return (
//     <section id="faq" className="relative py-16">
//       <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10">
//         <div>
//           <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs w-max">FAQ’s</div>
//           <h3 className="mt-4 text-4xl font-extrabold">Frequently asked<br />questions about our<br />AI services</h3>
//         </div>
//         <div className="space-y-3">
//           {items.map(({ question, answer }, i) => (
//             <div
//               key={i}
//               className="rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden"
//               data-aos="fade-up-left"
//               data-aos-delay={i * 120}
//               data-aos-offset="0"
//               data-aos-anchor-placement="top-bottom"
//             >
//               <button
//                 onClick={() => setOpen(open === i ? -1 : i)}
//                 className="w-full flex items-center justify-between py-5 px-8 text-left hover:bg-white/5 transition"
//               >
//                 <span className="font-medium pr-4">{question}</span>
//                 <span className="text-2xl text-white/50 cursor-pointer">{open === i ? '−' : '+'}</span>
//               </button>
//               {open === i && (
//                 <div className="px-8 pb-6 text-sm text-white/70 border-t border-white/10">
//                   {answer}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// const Home = () => {
//   const navigate = useNavigate();
//   const goToSignUp = () => navigate('/signup');

//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       once: false,
//       easing: 'ease-out-quart',
//     });
//     AOS.refresh();
//   }, []);

//   return (
//     <div className="relative min-h-screen text-white">
//       <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#150b25] via-[#0b0516] to-[#0b0516]" />
//       <div
//         className="pointer-events-none absolute -top-28 -left-28 h-[560px] w-[560px] z-0 rounded-full blur-3xl"
//         style={{ background: 'radial-gradient(circle, rgba(128,84,255,0.22) 0%, transparent 60%)' }}
//       />
//       <div
//         className="pointer-events-none absolute top-1/4 right-0 translate-x-1/4 h-[420px] w-[420px] z-0 rounded-full blur-3xl"
//         style={{ background: 'radial-gradient(circle, rgba(80,120,255,0.16) 0%, transparent 60%)' }}
//       />
//       <div
//         className="pointer-events-none absolute top-1/3 -right-32 h-[520px] w-[520px] z-0 rounded-full blur-3xl"
//         style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 60%)' }}
//       />
//       <div
//         className="pointer-events-none absolute top-[65%] left-1/2 -translate-x-1/2 h-[800px] w-[1000px] z-0 rounded-full blur-3xl"
//         style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.16) 0%, transparent 65%)' }}
//       />
//       <div className="relative z-10">
//         <Hero onSignup={goToSignUp} />
//         <Statement />
//         <HowItWorks onSignup={goToSignUp} />
//         <VideoSection />
//         <Templates />
//         <Features />
//         <FAQ />
//       </div>
//     </div>
//   );
// };

// export default Home;



































import React, { useContext, useState, createContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Icons Imports
import { FiSun, FiMoon, FiMonitor, FiMenu, FiX, FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiYoutube } from 'react-icons/fi';
import { GoArrowUpRight, GoArrowDownRight, GoArrowDownLeft } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";

// Image Imports (Keeping Code 1 Paths as requested)
import logo from "@/Web-Builder/assets/inai-black.png";
import whitelogo from "@/Web-Builder/assets/inai-white-logo.png";
// Banner Image
import bannerImg from "@/Web-Builder/assets/banner1.png";
// Editor Images
import editorImg from "@/Web-Builder/assets/editor.png";
import editDesignImg from "@/Web-Builder/assets/edit-design.png";
// Template Images
import t1 from '@/Web-Builder/assets/t1.png';
import t2 from '@/Web-Builder/assets/t2.png';
import t3 from '@/Web-Builder/assets/t3.png';
import t4 from '@/Web-Builder/assets/t4.png';
import t5 from '@/Web-Builder/assets/t5.png';
import t6 from '@/Web-Builder/assets/t6.png';
import t7 from '@/Web-Builder/assets/t7.png';
import Cookies from "js-cookie";
// ==============================
// 1. THEME CONTEXT & PROVIDER (FIXED & IMPROVED)
// ==============================
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // LocalStorage check karein, agar nahi hai to 'light' default
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;

    // Function jo actual class add/remove karega
    const applyTheme = (themeMode) => {
      if (themeMode === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else if (themeMode === 'light') {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else if (themeMode === 'system') {
        localStorage.setItem('theme', 'system');
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(theme);

    // System theme change listener (Agar user system theme change kare to site bhi change ho)
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode: setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ==============================
// 2. COMPONENTS
// ==============================

const Navbar = () => {
  const { theme, setThemeMode } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const username = Cookies.get("username"); // 👈 Cookie name must match your backend cookie key

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img src={theme === 'dark' ? whitelogo : logo} alt="INAI WORLDS" className="h-[70px] w-[120px]" />
          </div>

          {/* Desktop/Tablet Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Multi-State Theme Toggle */}
            <div className="flex items-center border-2 border-black dark:border-white rounded-3xl p-1 bg-white dark:bg-gray-800">
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-2 rounded-full ${theme === 'system' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'} transition-colors`}
                title="System Theme"
              >
                <FiMonitor size={20} />
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-2 rounded-full ${theme === 'light' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'} transition-colors`}
                title="Light Mode"
              >
                <FiSun size={20} />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'} transition-colors`}
                title="Dark Mode"
              >
                <FiMoon size={20} />
              </button>
            </div>

            {username ? (
              <>
                <div className="flex items-center text-black dark:text-white font-semibold px-4">
                  <FaUser className="mr-2" size={16} />
                  <span>{username}</span>
                </div>

                <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-black text-black dark:text-white rounded-lg transition-colors rounded-full"
                  style={{
                    border: theme === 'dark' ? '1px solid #FFFFFF' : '1px solid #000000',
                    boxShadow: theme === 'dark' ? '2px 2px 0px 0px #FFFFFF' : '2px 2px 0px 0px #333333'
                  }}
                >
                  <span>Get Started</span>
                  <GoArrowUpRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin" className="flex items-center space-x-2 px-4 py-2 text-black dark:text-white">
                  <FaUser size={16} />
                  <span>Sign In</span>
                </Link>

                <Link to="/signup" className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-black text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-full"
                  style={{
                    border: theme === 'dark' ? '1px solid #FFFFFF' : '1px solid #000000',
                    boxShadow: theme === 'dark' ? '2px 2px 0px 0px #FFFFFF' : '2px 2px 0px 0px #333333'
                  }}
                >
                  <span>Get Started</span>
                  <GoArrowUpRight size={16} />
                </Link>
              </>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="p-2 text-black dark:text-white">
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center border-2 border-black dark:border-white rounded-3xl p-1 bg-white dark:bg-gray-800 mx-auto">
                <button onClick={() => handleThemeChange('system')} className={`p-2 rounded-full ${theme === 'system' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                  <FiMonitor size={20} />
                </button>
                <button onClick={() => handleThemeChange('light')} className={`p-2 rounded-full ${theme === 'light' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                  <FiSun size={20} />
                </button>
                <button onClick={() => handleThemeChange('dark')} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                  <FiMoon size={20} />
                </button>
              </div>

              <Link to="/signin" className="flex items-center justify-center space-x-2 px-4 py-2 text-black dark:text-white mx-auto">
                <FaUser size={16} />
                <span>Sign In</span>
              </Link>

              <Link to="/signup" className="flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-black text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-full mx-auto"
                style={{
                  border: theme === 'dark' ? '1px solid #FFFFFF' : '1px solid #000000',
                  boxShadow: theme === 'dark' ? '2px 2px 0px 0px #FFFFFF' : '2px 2px 0px 0px #333333'
                }}
              >
                <span>Get Started</span>
                <GoArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Banner = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <section id="home" className="relative bg-[#f1f5f9] dark:bg-[#1A1A1A] pt-5 h-[400px] md:h-[500px] lg:h-[600px] overflow-visible transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Empower  business
            <span className="block text-black dark:text-white">growth with AI technologies</span>
            <span className="block text-black dark:text-white">today</span>
          </h3>

          <p className="text-sm md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 lg:mb-10 max-w-2xl md:max-w-3xl mx-auto px-4 md:px-0">
            Transform your ideas into reality with our AI-powered website builder. Create stunning websites in minutes, not hours.
          </p>

          <div className="flex flex-row gap-3 md:gap-4 justify-center px-4 md:px-0">
            <Link to="/signup" className="w-[160px] md:w-[190px] h-[44px] md:h-[49px] px-4 md:px-5 py-[12px] md:py-[14px] text-black bg-white dark:bg-[#0E0D0D] dark:text-white border border-black rounded-md shadow-[2px_2px_0px_0px_#000000] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
              style={{
                border: theme === 'dark' ? '1px solid #FFFFFF' : '1px solid #000000',
                boxShadow: theme === 'dark' ? '2px 2px 0px 0px #FFFFFF' : '2px 2px 0px 0px #333333'
              }}
            >
              <span>Get Started</span>
              <GoArrowUpRight size={16} />
            </Link>

            <button className="w-[160px] md:w-[190px] h-[44px] md:h-[49px] px-4 md:px-5 py-[12px] md:py-[14px] text-white bg-black dark:bg-white dark:text-black rounded-md shadow-[inset_0px_4px_10px_0px_#FFFFFF9E] hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 text-sm md:text-base"
              style={{
                backgroundColor: theme === 'dark' ? '#FFFFFF' : '#000000',
                boxShadow: theme === 'dark' ? '0px 4px 10px 0px #0000009E inset' : 'inset_0px_4px_10px_0px_#FFFFFF9E'
              }}
            >
              See How It Works
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-4 md:px-0">
        <img src={bannerImg} alt="banner" className="w-[400px] md:w-[650px] lg:w-[1000px] h-[150px] md:h-[350px] lg:h-[400px] opacity-100 rounded-[10px] md:rounded-[15px] lg:rounded-[20px]" />
      </div>

      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-200" style={{ top: '400px' }}></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[660px] h-0.5 bg-gray-200" style={{ top: '464px' }}></div>
        <div className="absolute w-0.5 h-32 bg-gray-200" style={{ top: '464px', left: 'calc(50% - 330px)' }}></div>
        <div className="absolute w-0.5 h-32 bg-gray-200" style={{ top: '464px', left: 'calc(50% + 330px)' }}></div>
      </div>
    </section>
  );
};

const SectionBoxes = () => {
  const { theme } = useContext(ThemeContext);
  const sections = [
    {
      id: 1,
      category: 'Plan',
      title: 'Sitemaps',
      description: 'Quickly Map-Out Your Website Pages With An AI-Generated Sitemap',
      items: ['Navbar', 'Hero Header Section', 'Feature Section', 'Features List Section', 'Features List Section', '+ Section'],
      color: 'border-[#4E00FF]',
      bgColor: 'bg-[#F6F2FF]'
    },
    {
      id: 2,
      category: 'Structure',
      title: 'Wireframes',
      description: 'Effortlessly Structure Your Pages And Copy With Distraction-Free Wireframes',
      items: ['Navbar', 'Hero Header Section', 'Feature Section', 'Features List Section', 'Features List Section', '+ Section'],
      color: 'border-[#FF5100]',
      bgColor: 'bg-[#FFF3ED]'
    },
    {
      id: 3,
      category: 'Conceptualise',
      title: 'Style Guide',
      description: 'Instantly Create Design Concepts And Apply The Winning Style Across Pages',
      items: ['Navbar', 'Hero Header Section', 'Feature Section', 'Features List Section', 'Features List Section', '+ Section'],
      color: 'border-[#006600]',
      bgColor: 'bg-[#F3FFF3]'
    },
  ];

  return (
    <section className="pb-8 md:pb-12 lg:pb-16 bg-white dark:bg-black mt-[100px] md:mt-[250px] lg:mt-[330px] md:flex-col transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
          {sections.map((section) => (
            <div key={section.id} className={`relative flex flex-col w-full sm:w-1/2 lg:w-1/4 p-4 md:p-5 lg:p-6 border-2 ${section.color} ${section.bgColor} dark:bg-gray-800 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] max-h-[500px] md:max-h-[600px] lg:max-h-[700px] max-w-[300px] md:max-w-[350px] lg:max-w-[350px]`}
              style={{
                textAlign: 'center',
                borderColor: theme === 'dark' ? '#FFFFFF' : undefined,
                backgroundColor: theme === 'dark' ? '#1A1A1A' : undefined
              }}
            >
              <div className={`absolute w-3 h-3 ${theme === 'dark' ? 'bg-white' : (section.id === 1 ? 'bg-[#4E00FF]' : section.id === 2 ? 'bg-[#FF5100]' : 'bg-[#006600]')} -top-[6px] -left-[6px]`}></div>
              <div className={`absolute w-3 h-3 ${theme === 'dark' ? 'bg-white' : (section.id === 1 ? 'bg-[#4E00FF]' : section.id === 2 ? 'bg-[#FF5100]' : 'bg-[#006600]')} -top-[6px] -right-[6px]`}></div>
              <div className={`absolute w-3 h-3 ${theme === 'dark' ? 'bg-white' : (section.id === 1 ? 'bg-[#4E00FF]' : section.id === 2 ? 'bg-[#FF5100]' : 'bg-[#006600]')} -bottom-[6px] -left-[6px]`}></div>
              <div className={`absolute w-3 h-3 ${theme === 'dark' ? 'bg-white' : (section.id === 1 ? 'bg-[#4E00FF]' : section.id === 2 ? 'bg-[#FF5100]' : 'bg-[#006600]')} -bottom-[6px] -right-[6px]`}></div>
              <p className="text-xs md:text-sm font-semibold text-gray-600 dark:text-white mb-2">{section.category}</p>
              <h3 className={`text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 ${section.id === 1 ? 'text-[#4E00FF] dark:text-white' : section.id === 2 ? 'text-[#FF5100] dark:text-white' : 'text-[#006600] dark:text-white'}`}>{section.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-white mb-4 md:mb-6 flex-grow">{section.description}</p>

              <div className="bg-white dark:bg-white rounded-lg p-3 md:p-4 shadow-md flex-grow">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-300 text-xs md:text-sm mb-3 md:mb-4">
                  <span className="flex items-center dark:text-black">
                    <span className='mr-2 dark:text-black text-xs md:text-sm'><IoHomeOutline /></span>
                    <span className="text-xs md:text-sm">Home</span>
                  </span>
                  <span className='dark:text-black text-xs md:text-sm'>...</span>
                </div>
                <div className="space-y-1 md:space-y-2 border border-[#6248FF] p-2 md:p-3 rounded"
                  style={{ borderColor: theme === 'dark' ? '#006600' : '#6248FF' }}
                >
                  {section.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-white rounded p-1 md:p-2 text-xs md:text-sm text-gray-700 dark:text-black border border-[#686868]"
                      style={{
                        borderColor: theme === 'dark' ? '#333333' : '#686868',
                        color: theme === 'dark' ? '#000000' : undefined
                      }}
                    >
                      <div className="flex items-center dark:text-black text-xs md:text-sm">
                        {item}
                      </div>
                      {item !== '+ Section' && (
                        <div className="h-1 md:h-2 bg-gray-200 dark:bg-gray-500 rounded mt-1 ml-2 md:ml-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EditorSection = () => {
  const { theme } = useContext(ThemeContext);
  const [activeItem, setActiveItem] = useState(0);

  const contentData = [
    { title: "Start With A Prompt", description: "Begin your website creation journey by providing a simple prompt. Describe your vision and let our AI understand your requirements to kickstart the design process." },
    { title: "Website Details", description: "Provide comprehensive details about your website including purpose, target audience, features needed, and design preferences. The more information you provide, the better the AI can tailor the design to your needs." },
    { title: "Let AI Do The Work", description: "Sit back and watch as our advanced AI algorithms analyze your requirements and generate a complete website design with layouts, color schemes, and content structure tailored to your specifications." },
    { title: "Fine-Tune Your Design", description: "Refine and perfect your website with our intuitive editing tools. Adjust layouts, modify colors, change fonts, and customize every element to match your exact vision and brand identity." },
    { title: "Edit Design", description: "Make final adjustments and tweaks to your website design. Add custom elements, optimize user experience, and ensure everything looks perfect before publishing your professional website." },
    { title: "Edit Design", description: "Make final adjustments and tweaks to your website design. Add custom elements, optimize user experience, and ensure everything looks perfect before publishing your professional website." }
  ];

  const imageMapping = [editorImg, editorImg, editDesignImg, editorImg, editDesignImg, editorImg];
  const listItems = ["Start with a Prompt", "Website Details", "Let AI Do The Work", "Fine-Tune Your Design", "Edit Design", "Edit Design"];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex:col md:text-center md:justify-between md:items-start mb-8 md:mb-12 lg:mb-16 lg:flex-row">
          <div className="mb-6 md:mb-0 text-center md:text-center w-full lg:text-start lg:w-[1300px]">
            <div className="flex items-center space-x-2 text-gray-700 dark:text-white mb-2 justify-center md:justify-center lg:justify-start w-full">
              <span className="text-lg md:text-xl">:compass:</span>
              <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-white">How It Works</span>
            </div>
            <div className="text-[15px] md:text-2xl lg:text-[32px] font-extrabold text-gray-800 dark:text-white leading-tight text-center md:text-center lg:text-left">
              Imagine a vast collection of <span className="relative inline-block border-2 border-[#4E00FF] dark:border-white bg-[#E0E7FF] dark:bg-[#1A1A1A] px-2 py-1 rounded"><span className="text-blue-600 dark:text-white">business</span>
                <div className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-[#4E00FF]'} -top-[4px] -left-[4px]`}></div>
                <div className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-[#4E00FF]'} -top-[4px] -right-[4px]`}></div>
                <div className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-[#4E00FF]'} -bottom-[4px] -left-[4px]`}></div>
                <div className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-[#4E00FF]'} -bottom-[4px] -right-[4px]`}></div>
              </span><br />
              apps at your disposal.
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-center gap-2 md:gap-3 mt-4 w-full md:w-full mb-8 md:mb-0">
            <button className="px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors dark:bg-white dark:text-black">Website Builder</button>
            <button className="px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors dark:bg-[#1A1A1A] dark:text-white">New Project</button>
            <button className="px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors dark:bg-[#1A1A1A] dark:text-white">IDE</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
          <div className="hidden lg:block lg:col-span-2 order-2 lg:order-1">
            <div className="space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{contentData[activeItem].title}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-white max-w-sm leading-relaxed">{contentData[activeItem].description}</p>
              <div className="hidden lg:block space-y-4 md:space-y-6">
                {listItems.map((item, i) => (
                  <div key={i} className="group" onClick={() => setActiveItem(i)}>
                    <div className={`h-[1px] w-full mb-2 ${activeItem === i ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`text-base md:text-lg cursor-pointer ${activeItem === i ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-3 order-1 lg:order-2 mb-8 lg:mb-0">
            <img src={imageMapping[activeItem]} className="rounded-xl shadow-2xl w-full h-[500px] transition-all duration-300" alt="Editor Preview" />
          </div>
        </div>

        <div className="lg:hidden space-y-12 md:space-y-16">
          {contentData.map((content, index) => (
            <div key={index} className="space-y-6 pb-12 md:pb-16 border-b border-gray-200 dark:border-[#333333] last:border-b-0">
              <div className="text-start md:text-center">
                <h5 className="text-[20px] md:text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.title}</h5>
                <p className="text-start md:text-lg text-gray-600 dark:text-white max-w-3xl mx-auto leading-relaxed">{content.description}</p>
              </div>
              <div className="flex justify-center">
                <img src={imageMapping[index]} className="rounded-xl shadow-2xl w-full max-w-2xl h-auto md:h-[400px]" alt={`Content Preview ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Templates = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <p className="text-gray-500 dark:text-white text-xs md:text-sm font-medium mb-2">Template</p>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            500k+ Websites built with <span className="relative inline-block">
              <span className="text-[#2E2F5B] dark:text-white border border-[#2E2F5B] dark:border-white bg-[#E9E9FF] dark:bg-[#1A1A1A] px-2 py-[0px] md:px-2 md:py-0 lg:px-3 lg:py-0">INAI</span>
              <div className={`absolute -top-[5px] -left-[2px] md:-top-[8px] md:-left-[5px] w-2 h-2 md:w-3 md:h-3 lg:-top-[14px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
              <div className={`absolute -top-[5px] -right-[2px] md:-top-[8px] md:-right-[5px] w-2 h-2 md:w-3 md:h-3 lg:-top-[14px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
              <div className={`absolute -bottom-[5px] -left-[2px] md:-bottom-[8px] md:-left-[5px] w-2 h-2 md:w-3 md:h-3 lg:-bottom-[14px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
              <div className={`absolute -bottom-[5px] -right-[2px] md:-bottom-[8px] md:-right-[5px] w-2 h-2 md:w-3 md:h-3 lg:-bottom-[14px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
            </span>
          </h2>
        </div>

        <div className="w-full h-auto md:h-auto lg:h-[500px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-8 md:mb-12 lg:mb-16">
          <div className="space-y-4 md:space-y-6">
            <img src={t1} alt="template1" className='h-full w-full object-cover border-2 border-black dark:border-white' />
          </div>
          <div className="space-y-1 flex flex-col">
            <img src={t2} alt="template1" className='h-[200px] md:h-[250px] w-full object-cover border-2 border-black dark:border-white' />
            <img src={t3} alt="template1" className='h-[200px] md:h-[250px] w-full object-cover border-2 border-black dark:border-white' />
          </div>
          <div className="space-y-1">
            <img src={t4} alt="template1" className='h-[280px] md:h-[350px] w-full object-cover border-2 border-black dark:border-white' />
            <img src={t5} alt="template1" className='h-[120px] md:h-[150px] w-full object-cover border-2 border-black dark:border-white' />
          </div>
          <div className="space-y-1">
            <img src={t6} alt="template1" className='h-[180px] md:h-[230px] w-full object-cover border-2 border-black dark:border-white' />
            <img src={t7} alt="template1" className='h-[220px] md:h-[270px] w-full object-cover border-2 border-black dark:border-white' />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesGrid = () => {
  const { theme } = useContext(ThemeContext);
  const features = [
    { title: "AI-Powered Design", description: "Quickly create a website by describing your idea in plain language. From a simple prompt, the builder generates full websites.", borderColor: "border-[#FDB400]", bgColor: "bg-[#FFF9EA]", squareColor: "bg-[#FDB400]" },
    { title: "Drag & Drop Editor", description: "Easily customize every element with our intuitive drag and drop interface. No coding required.", borderColor: "border-[#FF0004]", bgColor: "bg-[#FFF8F8]", squareColor: "bg-[#FF0004]" },
    { title: "Responsive Templates", description: "Choose from hundreds of professionally designed templates that work perfectly on all devices.", borderColor: "border-[#003CFF]", bgColor: "bg-[#F5F7FF]", squareColor: "bg-[#003CFF]" },
    { title: "SEO Optimization", description: "Built-in SEO tools help your website rank higher in search results and attract more visitors.", borderColor: "border-[#003CFF]", bgColor: "bg-[#F5F7FF]", squareColor: "bg-[#003CFF]" },
    { title: "E-commerce Ready", description: "Complete online store functionality with payment processing, inventory management, and more.", borderColor: "border-[#FDB400]", bgColor: "bg-[#FFF9EA]", squareColor: "bg-[#FDB400]" },
    { title: "Analytics Dashboard", description: "Track visitor behavior, conversion rates, and key metrics with our comprehensive analytics tools.", borderColor: "border-[#FF0004]", bgColor: "bg-[#FFF8F8]", squareColor: "bg-[#FF0004]" },
    { title: "Custom Domains", description: "Connect your own domain name or get a free subdomain to establish your online presence.", borderColor: "border-[#FF0004]", bgColor: "bg-[#FFF8F8]", squareColor: "bg-[#FF0004]" },
    { title: "24/7 Support", description: "Get help whenever you need it with our round-the-clock customer support team.", borderColor: "border-[#003CFF]", bgColor: "bg-[#F5F7FF]", squareColor: "bg-[#003CFF]" },
    { title: "Fast Hosting", description: "Lightning-fast hosting with 99.9% uptime ensures your website is always available and performs great.", borderColor: "border-[#FDB400]", bgColor: "bg-[#FFF9EA]", squareColor: "bg-[#FDB400]" }
  ];

  return (
    <div className="py-16 px-8 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-gray-700 dark:text-white">From Prompt to Published Website in One Platform</p>
        <h6 className="text-[40px] md:text-[40px] font-bold text-black dark:text-white">
          Everything You Need to Create a <span className="relative inline-block border-2 border-blue-600 dark:border-white rounded px-5 text-blue-600 dark:text-white bg-[#F3F3FF] dark:bg-black">
            Website
            <span className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-blue-600'} -top-1 -left-1`}></span>
            <span className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-blue-600'} -top-1 -right-1`}></span>
            <span className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-blue-600'} -bottom-1 -left-1`}></span>
            <span className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-blue-600'} -bottom-1 -right-1`}></span>
          </span> With AI, From Start to Finish
        </h6>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className={`relative p-6 border ${feature.borderColor} ${feature.bgColor} dark:bg-black dark:border-white hover:shadow-lg transition-shadow duration-300`}>
            <div className={`absolute -top-1 -left-1 w-2 h-2 z-10 ${theme === 'dark' ? 'bg-white' : feature.squareColor}`}></div>
            <div className={`absolute -top-1 -right-1 w-2 h-2 z-10 ${theme === 'dark' ? 'bg-white' : feature.squareColor}`}></div>
            <div className={`absolute -bottom-1 -left-1 w-2 h-2 z-10 ${theme === 'dark' ? 'bg-white' : feature.squareColor}`}></div>
            <div className={`absolute -bottom-1 -right-1 w-2 h-2 z-10 ${theme === 'dark' ? 'bg-white' : feature.squareColor}`}></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
            <p className="text-gray-600 dark:text-white leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQ = () => {
  const { theme } = useContext(ThemeContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    { question: "Is my data safe with Ai-Con?", answer: "Yes, absolutely. We take data security very seriously and use industry-standard encryption to protect your information. All data is stored securely in compliance with GDPR and other privacy regulations." },
    { question: "How does the AI website builder work?", answer: "Our AI website builder uses advanced machine learning algorithms to understand your requirements and generate custom website designs. Simply describe what you want, and our AI will create a professional website tailored to your needs in minutes." },
    { question: "Can I customize the generated websites?", answer: "Yes, absolutely. While our AI creates a great starting point, you have full control to customize every aspect of your website. You can modify colors, fonts, layouts, content, and more using our intuitive drag-and-drop editor." },
    { question: "What hosting options are available?", answer: "We offer flexible hosting solutions including free hosting with subdomains, custom domain support, and enterprise-grade hosting for high-traffic websites. All hosting plans include SSL certificates, automatic backups, and 99.9% uptime guarantee." },
    { question: "Is there a free trial available?", answer: "Yes! We offer a free forever plan that includes basic features and hosting. You can build and publish your website without any cost. Premium features are available with paid plans starting at just $9/month." },
    { question: "Can I export my website?", answer: "Yes, you can export your website code at any time. We support exporting clean HTML/CSS/JS code that you can host anywhere. This ensures you're never locked into our platform." },
    { question: "Do you provide customer support?", answer: "We offer 24/7 customer support via email, chat, and phone for all paid plans. Free plan users have access to our comprehensive knowledge base and community forums." },
    { question: "Can I integrate third-party services?", answer: "Yes, our platform supports integrations with popular services like Google Analytics, Mailchimp, PayPal, Stripe, and many more. You can also add custom code for additional integrations." }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className='text-center text-gray-700 dark:text-white'>FAQ's</p>
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-4xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 ">
            Frequently asked <span className="relative inline-block">
              <span className="text-[#2E2F5B] dark:text-white border border-[#2E2F5B] dark:border-white bg-[#E9E9FF] dark:bg-[#1A1A1A] px-2 py-[0px] md:px-3 md:py-1 lg:px-3 lg:py-0">questions</span>
              <div className={`absolute -top-[5px] -left-[2px] md:-top-[13px] md:-left-[5px] w-2 h-2 md:w-3 md:h-3 lg:-top-[11px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
              <div className={`absolute -top-[5px] -right-[2px] md:-top-[13px] md:-right-[5px] w-2 h-2 md:w-3 md:h-3 lg:-top-[11px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
              <div className={`absolute -bottom-[5px] -left-[2px] md:-bottom-[13px] md:-left-[5px] w-2 h-2 md:w-3 md:h-3 lg:-bottom-[11px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
              <div className={`absolute -bottom-[5px] -right-[2px] md:-bottom-[13px] md:-right-[5px] w-2 h-2 md:w-3 md:h-3 lg:-bottom-[11px] ${theme === 'dark' ? 'bg-white' : 'bg-[#2E2F5B]'}`}></div>
            </span>
          </h2>
          <h2 className="text-xl md:text-4xl lg:text-4xl font-bold text-black dark:text-gray-300">
            about our AI services
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 dark:border-white rounded-lg overflow-hidden">
              <button onClick={() => toggleFAQ(index)} className="w-full px-6 py-4 text-left bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <div className="flex-shrink-0 ml-4">
                  {activeIndex === index ? (
                    <GoArrowDownLeft size={20} className={`text-black dark:text-white border border-black dark:border-white rounded-full p-1 h-6 w-6`} />
                  ) : (
                    <GoArrowDownRight size={20} className={`text-black dark:text-white border border-black dark:border-white rounded-full p-1 h-6 w-6`} />
                  )}
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 py-4 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white">
                  <p className="text-gray-600 dark:text-white leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const socialLinks = [
    { icon: FiInstagram, href: "#", label: "Instagram" },
    { icon: FiFacebook, href: "#", label: "Facebook" },
    { icon: FiTwitter, href: "#", label: "Twitter" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn" },
    { icon: FiYoutube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 border-t border-gray-200 dark:border-white">
          <div className="flex flex-row md:flex-row justify-between items-center w-full">
            <div className="md:mt-0 text-gray-600 dark:text-white text-sm mb-4 md:mb-0">
              <img src={theme === 'dark' ? whitelogo : logo} alt="INAI WORLD" className='w-[80px] h-[50px] md:w-[120px] md:h-[70px] pt-2' />
            </div>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} aria-label={social.label} className="md:p-2 lg:p-2 text-black dark:text-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==============================
// 3. MAIN HOME COMPONENT
// ==============================

function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="mx-8 md:mx-8 lg:mx-16 border-x border-black dark:border-white relative transition-colors duration-300">

          <div className="border-b border-black dark:border-white relative transition-colors duration-300">
            <Navbar />
          </div>

          <div className="relative">
            <Banner />
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-black dark:bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-black dark:bg-white"></div>
          </div>

          <div className="border-b border-black dark:border-white relative transition-colors duration-300">
            <SectionBoxes />
          </div>

          <div className="border-b border-black dark:border-white relative transition-colors duration-300">
            <EditorSection />
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-black dark:bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-black dark:bg-white"></div>
          </div>

          <div className="border-b border-black dark:border-white relative transition-colors duration-300">
            <Templates />
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-black dark:bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-black dark:bg-white"></div>
          </div>

          <div className="border-b border-black dark:border-white relative transition-colors duration-300">
            <FeaturesGrid />
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-black dark:bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-black dark:bg-white"></div>
          </div>

          <div className="relative">
            <FAQ />
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-black dark:bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-black dark:bg-white"></div>
          </div>

          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Home;