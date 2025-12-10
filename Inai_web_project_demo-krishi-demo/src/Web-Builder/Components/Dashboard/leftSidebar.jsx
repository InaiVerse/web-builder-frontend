// // Components/Sidebar.jsx
// import { FiSearch } from "react-icons/fi";
// import { RiHome2Fill } from "react-icons/ri";
// import { MdOutlineUnsubscribe } from "react-icons/md";
// import { IoIosHelpCircleOutline } from "react-icons/io";
// import { GrAnnounce } from "react-icons/gr";
// import { MdOutlineMonitorHeart } from "react-icons/md";
// import { IoClose } from "react-icons/io5";
// import { NavLink } from "react-router-dom";

// export default function LeftSidebar({ className = "", onClose } = {}) {
//   const containerClasses = [
//     "bg-[#101010] text-white p-4 sm:p-6 flex flex-col overflow-y-auto",
//     "w-full sm:w-72 lg:w-64",
//     "xl:sticky xl:top-0 xl:h-screen xl:max-h-screen",
//     className,
//   ]
//     .filter(Boolean)
//     .join(" ");

//   const navItems = [
//     {
//       label: "Recents",
//       to: "/dashboard",
//       Icon: RiHome2Fill,
//     },
//     {
//       label: "Monitoring",
//       to: "/monitoring",
//       Icon: MdOutlineMonitorHeart,
//     },
//   ];

//   return (
//     <div className={containerClasses}>
//       {/* Logo */}
//       <div className="mb-6 relative flex items-center justify-center gap-3">
//         <div className="flex w-20 sm:w-24 lg:w-24 justify-center">
//           <img
//             src="https://inaiverse.com/assets/INAI-DcQcSw2x.png"
//             alt="logo"
//             className="h-auto w-full"
//           />
//         </div>
//         {onClose ? (
//           <button
//             type="button"
//             onClick={onClose}
//             className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
//             aria-label="Close sidebar"
//           >
//             <IoClose className="h-5 w-5" />
//           </button>
//         ) : null}
//       </div>

//       {/* Search Bar */}
//       <div className="mb-8">
//         <label className="relative block text-sm text-white/70">
//           <span className="sr-only">Search projects</span>
//           <FiSearch className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/40" />
//           <input
//             type="text"
//             className="block w-full rounded-xl border border-white/5 bg-[#18181A] py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 transition focus:border-[#8054FF] focus:outline-none focus:ring-2 focus:ring-[#8054FF]/70"
//             placeholder="Search"
//           />
//         </label>
//       </div>

//       {/* Menu */}
//       <div className="mb-8">
//         <ul className="space-y-1 text-white">
//           {navItems.map(({ label, to, Icon }) => (
//             <li key={to}>
//               <NavLink
//                 to={to}
//                 className={({ isActive }) =>
//                   [
//                     "flex items-center rounded-lg px-3 py-2 text-sm transition",
//                     isActive
//                       ? "bg-[#1E1E1E] text-white"
//                       : "text-gray-400 hover:bg-[#1E1E1E] hover:text-white",
//                   ].join(" ")
//                 }
//                 onClick={() => {
//                   if (onClose) {
//                     onClose();
//                   }
//                 }}
//               >
//                 <Icon className="mr-3 text-current" />
//                 {label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Bottom Section */}
//       <div className="mt-auto space-y-4 rounded-xl p-4">
//         <NavLink
//           to="/pricing"
//           className={({ isActive }) =>
//             [
//               "flex items-center rounded-lg px-3 py-2 text-sm transition",
//               isActive
//                 ? "bg-[#1E1E1E] text-white"
//                 : "text-white/80 hover:bg-[#1E1E1E] hover:text-white",
//             ].join(" ")
//           }
//           onClick={() => {
//             if (onClose) {
//               onClose();
//             }
//           }}
//         >
//           <MdOutlineUnsubscribe className="mr-3 h-5 w-5" />
//           <span>Subscription</span>
//         </NavLink>
//         <NavLink
//           to="/help"
//           className={({ isActive }) =>
//             [
//               "flex items-center rounded-lg px-3 py-2 text-sm transition",
//               isActive
//                 ? "bg-[#1E1E1E] text-white"
//                 : "text-white/80 hover:bg-[#1E1E1E] hover:text-white",
//             ].join(" ")
//           }
//           onClick={() => {
//             if (onClose) {
//               onClose();
//             }
//           }}
//         >
//           <IoIosHelpCircleOutline className="mr-3 h-5 w-5" />
//           <span>Help</span>
//         </NavLink>
//         <NavLink
//           to="/updates"
//           className={({ isActive }) =>
//             [
//               "flex items-center rounded-lg px-3 py-2 text-sm transition",
//               isActive
//                 ? "bg-[#1E1E1E] text-white"
//                 : "text-white/80 hover:bg-[#1E1E1E] hover:text-white",
//             ].join(" ")
//           }
//           onClick={() => {
//             if (onClose) {
//               onClose();
//             }
//           }}
//         >
//           <GrAnnounce className="mr-3 h-5 w-5" />
//           <span>Latest Updates</span>
//         </NavLink>
//       </div>
//     </div>
//   );
// }






















import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardIcon, 
  WebBuilderIcon, 
  ProjectBuilderIcon, 
  IdeIcon, 
  SearchIcon 
} from "@/Web-Builder/icons/Icons";
import Inai_black from '@/Web-Builder/assets/inai-black.png';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/Dashboard' },
        { name: 'Web Builder', icon: <WebBuilderIcon />, path: '/web-builder' },
        { name: 'Project Builder', icon: <ProjectBuilderIcon />, path: '/project-builder' },
        { name: 'IDE', icon: <IdeIcon width={16} height={16} color="#333333" />, path: '/IDE' },
    ];

    return (
        <aside className="w-[260px] bg-white border-r border-[#e0e0e0] p-6 flex flex-col h-screen box-border fixed -left-full top-0 z-[1000] transition-[left] duration-300 shadow-md md:static md:shadow-none lg:w-[220px] lg:p-5 xl:w-[260px]">
            <div className="mb-8">
                <img src={Inai_black} alt="INAI WORLDS Logo" className="w-[100px] h-[100px] justify-self-center" />
            </div>

            <div className="mb-8 lg:mb-6">
                <div className="flex items-center gap-2.5 p-2.5 px-3.5 border border-[#e0e0e0] rounded-lg bg-white transition-colors focus-within:border-[#333333]">
                    <SearchIcon width={14} height={14} color="#666666" />
                    <input type="text" placeholder="Search.." className="border-none outline-none w-full text-sm text-[#333333] bg-transparent placeholder-[#999999]" />
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center gap-3 p-3 px-4 rounded-lg cursor-pointer text-sm transition-all text-left lg:p-2.5 lg:px-3.5 lg:text-[13px] ${isActive(item.path)
                            ? 'bg-white border-2 border-[#333333] font-semibold text-[#333333]'
                            : 'bg-transparent border border-transparent font-medium text-[#666666] hover:bg-[#f5f5f5] hover:text-[#333333]'
                            }`}
                    >
                        <span className="flex items-center justify-center w-5 h-5">{item.icon}</span>
                        <span>{item.name}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;