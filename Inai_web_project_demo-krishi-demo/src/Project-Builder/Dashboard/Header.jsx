import React, { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import Inai_black from '@/Web-Builder/assets/inai-black.png';
import Cookies from "js-cookie";
import { CiGift } from 'react-icons/ci';
import { CgDarkMode } from 'react-icons/cg';
import { IoIosSettings } from 'react-icons/io';
import { IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const username = Cookies.get("username");
  const navigate = useNavigate();

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

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
      navigate("/signin");
    }
  };

  return (
    <header className="w-full px-10 py-2 flex justify-between items-center relative">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <img
          className="h-25 w-25"
          src={Inai_black}
          alt="INAI Logo"
        />
      </div>

      {/* Profile Button */}
      <div className="relative">
        <button
          onClick={toggleProfile}
          style={{
            border: '1px solid #000000',
            boxShadow: '2px 2px 0px 0px #333333',
            color: '#333333',
            padding: '8px 16px',
            borderRadius: '6px',
            width: '170px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <FaUserCircle size={20} />
          <span
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#212121',
              textTransform: 'capitalize',
              letterSpacing: '0.5px'
            }}
          >
            {username || "User"}
          </span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1a1a1a] border border-white/5 p-4 text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)] z-50">
            <div className="flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <FaUserCircle className="h-6 w-6" />
              </div>
            </div>

            <ul className="mt-4 space-y-3 text-sm">
              <li className="dropdown-item cursor-pointer hover:bg-white/5 p-2 rounded-lg">
                <CiGift className="mr-2 h-5 w-5 inline" /> Get free credits
              </li>
              <li
                className="dropdown-item cursor-pointer hover:bg-white/5 p-2 rounded-lg"
                onClick={() => navigate("/appearance")}
              >
                <CgDarkMode className="mr-2 h-5 w-5 inline" /> Appearance
              </li>
              <li
                className="dropdown-item cursor-pointer hover:bg-white/5 p-2 rounded-lg"
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
    </header>
  );
};

export default Header;
