// import React, { useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// import { FaEye, FaEyeSlash, FaChevronDown, FaGoogle } from 'react-icons/fa';
// import { FaRegUserCircle } from 'react-icons/fa';
// import { HiOutlineMail } from 'react-icons/hi';
// import { MdLockOutline } from 'react-icons/md';
// import ReactCountryFlag from 'react-country-flag';
// import Cookies from 'js-cookie';

// const SignUp = () => {
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = React.useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
//     const [showCountryDropdown, setShowCountryDropdown] = React.useState(false);

//     const [formData, setFormData] = React.useState({
//         username: '',
//         email: '',
//         phone_number: '',
//         password: '',
//         confirm_password: ''
//     });

//     const [status, setStatus] = React.useState({
//         loading: false,
//         error: '',
//         success: ''
//     });

//     const dropdownRef = useRef(null);

//     // click outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowCountryDropdown(false);
//             }
//         };
//         if (showCountryDropdown) {
//             document.addEventListener('mousedown', handleClickOutside);
//         }
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [showCountryDropdown]);

//     const [selectedCountry, setSelectedCountry] = React.useState({
//         code: 'IN',
//         name: 'India'
//         // dialCode removed
//     });

//     const countries = [
//         { code: 'IN', name: 'India' },
//         { code: 'US', name: 'United States' },
//         { code: 'GB', name: 'United Kingdom' },
//         { code: 'CA', name: 'Canada' },
//         { code: 'AU', name: 'Australia' },
//         { code: 'DE', name: 'Germany' },
//         { code: 'FR', name: 'France' },
//         { code: 'JP', name: 'Japan' },
//         { code: 'CN', name: 'China' },
//         { code: 'BR', name: 'Brazil' }
//     ];

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     // const handleSubmit = async (event) => {
//     //     event.preventDefault();
//     //     if (formData.password !== formData.confirm_password) {
//     //         setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
//     //         return;
//     //     }
//     //     setStatus({ loading: true, error: '', success: '' });

//     //     try {
//     //         const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
//     //             method: 'POST',
//     //             headers: { 'Content-Type': 'application/json' },
//     //             body: JSON.stringify({
//     //                 username: formData.username.trim(),
//     //                 email: formData.email.trim(),
//     //                 phone_number: formData.phone_number.trim(),
//     //                 password: formData.password,
//     //                 confirm_password: formData.confirm_password,
//     //                 login_method: 'manual'
//     //             })
//     //         });

//     //         const payload = await response.json();

//     //         if (!response.ok) {
//     //             setStatus({ loading: false, error: payload?.message || 'Signup failed.', success: '' });
//     //             return;
//     //         }

//     //         const authData = payload?.data;

//     //         if (authData) {
//     //             Cookies.set('access_token', authData.access_token);
//     //             Cookies.set('refresh_token', authData.refresh_token);
//     //             Cookies.set('user_id', authData.user_id);
//     //             Cookies.set('username', authData.username);
//     //             Cookies.set('email', authData.email);
//     //         }

//     //         setStatus({ loading: false, error: '', success: payload?.message || 'Account created successfully.' });
//     //         navigate('/dashboard');

//     //     } catch {
//     //         setStatus({ loading: false, error: 'Network error.', success: '' });
//     //     }
//     // };


//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         if (formData.password !== formData.confirm_password) {
//             setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
//             return;
//         }

//         setStatus({ loading: true, error: '', success: '' });

//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
//                 method: 'POST',
//                 headers: {
//                     accept: 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     username: formData.username.trim(),
//                     email: formData.email.trim(),
//                     phone_number: formData.phone_number.trim(),
//                     password: formData.password,
//                     confirm_password: formData.confirm_password,
//                     login_method: "string"   // <-- Updated
//                 })
//             });

//             const payload = await response.json();

//             if (!response.ok) {
//                 setStatus({ loading: false, error: payload?.message || 'Signup failed.', success: '' });
//                 return;
//             }

//             const authData = payload?.data;

//             if (authData) {
//                 Cookies.set('access_token', authData.access_token);
//                 Cookies.set('refresh_token', authData.refresh_token);
//                 Cookies.set('user_id', authData.user_id);
//                 Cookies.set('username', authData.username);
//                 Cookies.set('email', authData.email);
//             }

//             setStatus({ loading: false, error: '', success: payload?.message || 'Account created successfully.' });
//             navigate('/dashboard');

//         } catch {
//             setStatus({ loading: false, error: 'Network error.', success: '' });
//         }
//     };

//     return (
//         <div className="min-h-screen w-full bg-black relative overflow-hidden px-4 py-8 flex items-center justify-center">

//             {/* BG */}
//             <div className="absolute w-[500px] h-[500px] top-[-150px] left-[-200px] bg-pink-400/20 blur-[140px] rounded-full"></div>
//             <div className="absolute w-[500px] h-[500px] bottom-[-150px] right-[-200px] bg-purple-500/20 blur-[140px] rounded-full"></div>

//             <div className="relative z-10 w-11/12 mx-auto px-4">

//                 {/* DESKTOP ORIGINAL LAYOUT */}
//                 <div className="hidden md:grid md:grid-cols-[40%_60%] gap-8 bg-[#FFFFFF0A] backdrop-blur-md rounded-2xl px-10 py-12">

//                     {/* LEFT SIDE */}
//                     <div className="text-white flex flex-col justify-between">
//                         <div>
//                             <img src="../../Public/Logo.png" className="w-24 h-24 mb-4" />
//                             <h1 className="text-3xl font-bold leading-tight">
//                                 Begin Your <br />
//                                 <span className="bg-gradient-to-r from-[#FF9898] to-[#8054FF] bg-clip-text text-transparent">
//                                     AI
//                                 </span>{" "}
//                                 Journey
//                             </h1>
//                         </div>

//                         <p className="text-gray-300 text-sm">
//                             Already have an account?{" "}
//                             <Link to="/signin" className="text-pink-400 font-medium">Sign In</Link>
//                         </p>
//                     </div>

//                     {/* RIGHT FORM */}
//                     <div className="p-2 md:p-4">
//                         <form className="space-y-5" onSubmit={handleSubmit}>

//                             {/* Username */}
//                             <div>
//                                 {/* Google Sign Up Button */}
//                                 <button
//                                     type="button"
//                                     className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-2 rounded-lg font-medium hover:bg-white/4 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-100 mb-4"
//                                 >
//                                     <FaGoogle className="w-5 h-5" />
//                                     <span>Sign up with Google</span>
//                                 </button>

//                                 {/* OR Divider */}
//                                 <div className="flex items-center justify-center my-4">
//                                     <div className="w-full border-t border-gray-600"></div>
//                                     <span className="px-3 text-sm text-gray-400">OR</span>
//                                     <div className="w-full border-t border-gray-600"></div>
//                                 </div>
//                                 <label className="text-sm text-gray-300">Username</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg">
//                                     <span className="px-3 text-gray-400"><FaRegUserCircle /></span>
//                                     <input
//                                         type="text"
//                                         name="username"
//                                         value={formData.username}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter your username"
//                                         className="w-full bg-transparent text-white py-2 px-2"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Email</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg">
//                                     <span className="px-3 text-gray-400"><HiOutlineMail /></span>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                         placeholder="your@email.com"
//                                         className="w-full bg-transparent text-white py-2 px-2"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Phone */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Phone Number</label>
//                                 <div className="flex gap-2 items-stretch" ref={dropdownRef}>

//                                     {/* Country (FLAG ONLY) */}
//                                     <div className="relative shrink-0 w-16 flex items-center justify-center">
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//                                             className="flex items-center justify-center w-full bg-white/5 border border-[#262626] rounded-lg text-white px-3 py-2"
//                                         >
//                                             <ReactCountryFlag
//                                                 countryCode={selectedCountry.code}
//                                                 svg
//                                                 style={{ width: '1.5em', height: '1.5em' }}
//                                             />
//                                             <FaChevronDown className="text-gray-400 ml-2" />
//                                         </button>

//                                         {showCountryDropdown && (
//                                             <div className="absolute mt-1 w-60 max-h-60 overflow-auto bg-gray-800 border border-[#262626] rounded-lg z-20">
//                                                 {countries.map((c) => (
//                                                     <div
//                                                         key={c.code}
//                                                         onClick={() => {
//                                                             setSelectedCountry(c);
//                                                             setShowCountryDropdown(false);
//                                                         }}
//                                                         className="flex items-center px-4 py-2 cursor-pointer hover:bg-white/10"
//                                                     >
//                                                         <ReactCountryFlag
//                                                             countryCode={c.code}
//                                                             svg
//                                                             style={{ width: '1.5em', height: '1.5em' }}
//                                                         />
//                                                         <span className="text-white ml-3">{c.name}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Actual number */}
//                                     <input
//                                         type="tel"
//                                         name="phone_number"
//                                         value={formData.phone_number}
//                                         onChange={handleInputChange}
//                                         placeholder="00000-00000"
//                                         className="flex-1 bg-white/5 border border-[#262626] rounded-lg text-white px-3 py-2"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Password */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Password</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg">
//                                     <span className="px-3 text-gray-400"><MdLockOutline /></span>
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleInputChange}
//                                         placeholder="••••••••"
//                                         className="w-full bg-transparent text-white py-2 px-2"
//                                         required
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="px-3 text-gray-400 cursor-pointer"
//                                     >
//                                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Confirm */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Confirm Password</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg">
//                                     <span className="px-3 text-gray-400"><MdLockOutline /></span>
//                                     <input
//                                         type={showConfirmPassword ? "text" : "password"}
//                                         name="confirm_password"
//                                         value={formData.confirm_password}
//                                         onChange={handleInputChange}
//                                         placeholder="••••••••"
//                                         className="w-full bg-transparent text-white py-2 px-2"
//                                         required
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                         className="px-3 text-gray-400 cursor-pointer"
//                                     >
//                                         {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {status.error && (
//                                 <p className="text-sm text-red-400">{status.error}</p>
//                             )}

//                             {/* Submit */}
//                             <button
//                                 type="submit"
//                                 className="w-full py-3 cursor-pointer rounded-lg font-bold text-white bg-gradient-to-r from-[#FF9898] to-[#8054FF] hover:opacity-90 transition-all"
//                             >
//                                 {status.loading ? 'Creating account…' : 'Sign Up'}
//                             </button>

//                         </form>
//                     </div>

//                 </div>

//                 {/* MOBILE + TABLET UI */}
//                 <div className="md:hidden flex flex-col items-center w-full">

//                     <img src="../../Public/Logo.png" className="w-20 h-20 mb-3" />

//                     <h1 className="text-white text-3xl font-bold text-center mb-6 leading-tight">
//                         Begin Your <br />
//                         <span className="bg-gradient-to-r from-[#FF9898] to-[#8054FF] bg-clip-text text-transparent">
//                             AI
//                         </span>{" "}
//                         Journey
//                     </h1>

//                     <div className="w-full bg-[#FFFFFF0A] backdrop-blur-xl p-6 rounded-2xl shadow-xl">

//                         <form className="space-y-5" onSubmit={handleSubmit}>

//                             {/* Username */}
//                             <div>

//                                 {/* Google Sign Up Button */}
//                                 <button
//                                     type="button"
//                                     className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-2 rounded-lg font-medium hover:bg-white/4 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-100 mb-4"
//                                 >
//                                     <FaGoogle className="w-5 h-5" />
//                                     <span>Sign up with Google</span>
//                                 </button>
//                                 {/* OR Divider */}
//                                 <div className="flex items-center justify-center my-4">
//                                     <div className="w-full border-t border-gray-600"></div>
//                                     <span className="px-3 text-sm text-gray-400">OR</span>
//                                     <div className="w-full border-t border-gray-600"></div>
//                                 </div>

//                                 <label className="text-sm text-gray-300">Username</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg mt-1">
//                                     <span className="px-3 text-gray-400"><FaRegUserCircle /></span>
//                                     <input
//                                         type="text"
//                                         name="username"
//                                         value={formData.username}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter your username"
//                                         className="w-full bg-transparent text-white py-2 px-2"
//                                         required />
//                                 </div>
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Email</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg mt-1">
//                                     <span className="px-3 text-gray-400"><HiOutlineMail /></span>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                         placeholder="your@email.com"
//                                         className="w-full bg-transparent text-white py-2 px-2"
//                                         required />
//                                 </div>
//                             </div>

//                             {/* Phone */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Phone Number</label>

//                                 <div className="flex items-stretch gap-2 mt-1" ref={dropdownRef}>

//                                     {/* Country Flag ONLY */}
//                                     <div className="relative shrink-0 w-16 flex items-center justify-center">
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//                                             className="flex items-center justify-center w-full bg-white/5 border border-[#262626] rounded-lg text-white px-3 py-2"
//                                         >
//                                             <ReactCountryFlag
//                                                 countryCode={selectedCountry.code}
//                                                 svg
//                                                 style={{ width: '1.5em', height: '1.5em' }}
//                                             />
//                                             <FaChevronDown className="text-gray-400 ml-2" />
//                                         </button>

//                                         {showCountryDropdown && (
//                                             <div className="absolute mt-1 w-60 max-h-60 overflow-auto bg-gray-800 border border-[#262626] rounded-lg shadow-lg z-20">
//                                                 {countries.map((c) => (
//                                                     <div
//                                                         key={c.code}
//                                                         onClick={() => {
//                                                             setSelectedCountry(c);
//                                                             setShowCountryDropdown(false);
//                                                         }}
//                                                         className="flex items-center px-4 py-2 cursor-pointer hover:bg-white/10"
//                                                     >
//                                                         <ReactCountryFlag
//                                                             countryCode={c.code}
//                                                             svg
//                                                             style={{ width: '1.5em', height: '1.5em' }}
//                                                         />
//                                                         <span className="text-white ml-3">{c.name}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* User number input */}
//                                     <input
//                                         type="tel"
//                                         name="phone_number"
//                                         value={formData.phone_number}
//                                         onChange={handleInputChange}
//                                         placeholder="00000-00000"
//                                         className="flex-1 bg-white/5 border border-[#262626] rounded-lg text-white px-3 py-2"
//                                         required />
//                                 </div>
//                             </div>

//                             {/* Password */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Password</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg mt-1">
//                                     <span className="px-3 text-gray-400"><MdLockOutline /></span>
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleInputChange}
//                                         placeholder="••••••••"
//                                         className="w-full bg-transparent text-white py-2 px-2" required />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="px-3 text-gray-400">
//                                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Confirm Password */}
//                             <div>
//                                 <label className="text-sm text-gray-300">Confirm Password</label>
//                                 <div className="flex items-center bg-white/5 border border-[#262626] rounded-lg mt-1">
//                                     <span className="px-3 text-gray-400"><MdLockOutline /></span>
//                                     <input
//                                         type={showConfirmPassword ? "text" : "password"}
//                                         name="confirm_password"
//                                         value={formData.confirm_password}
//                                         onChange={handleInputChange}
//                                         placeholder="••••••••"
//                                         className="w-full bg-transparent text-white py-2 px-2" required />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                         className="px-3 text-gray-400">
//                                         {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Errors */}
//                             {status.error && <p className="text-red-400 text-sm">{status.error}</p>}

//                             {/* Submit */}
//                             <button
//                                 type="submit"
//                                 className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-[#FF9898] to-[#8054FF] hover:opacity-90"
//                             >
//                                 {status.loading ? 'Creating account…' : 'Sign Up'}
//                             </button>
//                         </form>
//                     </div>

//                     <p className="text-gray-300 text-center text-sm mt-6">
//                         Already have an account?{" "}
//                         <Link to="/signin" className="text-pink-400 font-medium">Sign In</Link>
//                     </p>

//                 </div>

//             </div>
//         </div>
//     );
// };

// export default SignUp;







































import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaApple, FaFacebookF, FaCheckSquare, FaSquare, FaEnvelope } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Cookies from 'js-cookie';
import { useTypewriter } from 'react-simple-typewriter';
import { FaChevronDown } from "react-icons/fa";

import logo from '../../assets/inai-black.png';
import ReactCountryFlag from 'react-country-flag';

const SignUp = () => {
    const navigate = useNavigate();
    // New UI States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    // Existing Logic State structure preserved
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: ''
    });

    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: ''
    });

    const [placeholderText] = useTypewriter({
        words: ['Example: "Explain quantum computing in simple terms"'],
        loop: true,
        typeSpeed: 50,
        deleteSpeed: 50,
        delaySpeed: 1000,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirm_password) {
            setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
            return;
        }

        setStatus({ loading: true, error: '', success: '' });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    phone_number: formData.phone_number.trim(),
                    password: formData.password,
                    confirm_password: formData.confirm_password,
                    login_method: "manual"
                })
            });

            const payload = await response.json();

            if (!response.ok) {
                setStatus({ loading: false, error: payload?.message || 'Signup failed.', success: '' });
                return;
            }

            const authData = payload?.data;

            if (authData) {
                Cookies.set('access_token', authData.access_token);
                Cookies.set('refresh_token', authData.refresh_token);
                Cookies.set('user_id', authData.user_id);
                Cookies.set('username', authData.username);
                Cookies.set('email', authData.email);
            }

            setStatus({ loading: false, error: '', success: payload?.message || 'Account created successfully.' });
            navigate('/dashboard');

        } catch (err) {
            setStatus({ loading: false, error: 'Network error.', success: '' });
        }
    };

    const [selectedCountry, setSelectedCountry] = useState({
        code: "IN",
        name: "India",
        dialCode: "+91",
        placeholder: "00000 00000"
    });

    // Is list ko update karein component ke andar
    const countries = [
        { code: "IN", name: "India", dialCode: "+91", placeholder: "00000 00000" },
        { code: "US", name: "United States", dialCode: "+1", placeholder: "(555) 555-1234" },
        { code: "GB", name: "United Kingdom", dialCode: "+44", placeholder: "07700 900077" },
        { code: "CA", name: "Canada", dialCode: "+1", placeholder: "(555) 555-1234" },
        { code: "AU", name: "Australia", dialCode: "+61", placeholder: "0400 123 456" },
        { code: "DE", name: "Germany", dialCode: "+49", placeholder: "0151 12345678" },
        { code: "FR", name: "France", dialCode: "+33", placeholder: "06 12 34 56 78" },
        { code: "JP", name: "Japan", dialCode: "+81", placeholder: "090-1234-5678" },
        { code: "CN", name: "China", dialCode: "+86", placeholder: "138 0013 8000" },
        { code: "BR", name: "Brazil", dialCode: "+55", placeholder: "(11) 91234-5678" }
    ];

    const handleSocialSignup = (provider) => {
        console.log(`Signup with ${provider}`);
    };


    return (
        <div className="min-h-screen bg-white transition-colors flex flex-col">
            <div className="flex flex-1 flex-col mx-8 md:mx-8 lg:mx-16 border-x border-black relative">
                <div className="absolute top-[3.75rem] -left-1 w-2 h-2 bg-black"></div>
                <div className="absolute top-[3.75rem] -right-1 w-2 h-2 bg-black"></div>
                <div className="relative mt-16 border-t border-black shrink-0"></div>
                <div className='flex flex-1'>

                    {/* Left Panel - Branding */}
                    <div className="flex-1 hidden lg:flex items-center justify-center p-10 relative min-h-[400px]">
                        <div className="w-full max-w-[540px] h-[500px] bg-white border-2 border-[#333333] relative flex flex-col items-center justify-center py-[60px] px-10">
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -top-[7px] -left-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -top-[7px] -right-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -bottom-[7px] -left-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -bottom-[7px] -right-[7px]"></div>

                            <div className="text-center mb-20">
                                <img src={logo} alt="INAI WORLDS Logo" className="max-w-full h-auto max-h-[150px] object-contain" />
                            </div>

                            <div className="w-full max-w-[400px] relative">
                                <input type="text"
                                    placeholder={placeholderText}
                                    readOnly
                                    className="w-full p-3 pr-12 border border-[#cccccc] rounded text-sm text-[#666666] outline-none focus:border-[#333333] transition-colors"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-[#cccccc] rounded p-1.5 cursor-pointer flex items-center justify-center hover:bg-[#f0f0f0]">
                                    <IoSend size={16} color="#999999" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Signup Form */}
                    <div className="flex-1 flex items-center justify-center p-10 bg-[#F1F5F9]">
                        <div className="w-full max-w-[400px]">
                            <p className="text-sm text-[#666666] mb-4 text-center">Register with:</p>
                            <div className="flex gap-3 mb-6 flex-col sm:flex-row">
                                {['Google', 'Apple', 'Facebook'].map((provider) => (
                                    <button key={provider} type="button" onClick={() => handleSocialSignup(provider)} className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-white border border-[#cccccc] rounded cursor-pointer transition-all text-sm text-[#333333] hover:bg-[#f9f9f9] hover:border-[#333333]">
                                        {provider === 'Google' && <FaGoogle />}
                                        {provider === 'Apple' && <FaApple />}
                                        {provider === 'Facebook' && <FaFacebookF />}
                                        <span className="hidden sm:inline">{provider}</span>
                                        <span className="sm:hidden">{provider}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center my-6 text-[#999999] text-xs">
                                <div className="flex-1 h-px bg-[#cccccc] mr-3"></div>Or<div className="flex-1 h-px bg-[#cccccc] ml-3"></div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-[13px] text-[#333333] mb-1.5">Username</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-[#666666] flex items-center"><FaUser color="#666666" /></div>
                                        <input
                                            type="text"
                                            name="username"
                                            className="w-full py-2 pr-3 pl-10 border border-[#cccccc] rounded text-sm text-[#333333] outline-none bg-white focus:border-[#333333]"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-[13px] text-[#333333] mb-1.5">Email</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-[#666666] flex items-center">
                                            <FaEnvelope color="#666666" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            className="w-full py-2 pr-3 pl-10 border border-[#cccccc] rounded text-sm text-[#333333] outline-none bg-white focus:border-[#333333]"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-[13px] text-[#333333] mb-1.5">Phone Number</label>

                                    {/* Flex Container to separate Country Box and Input Box */}
                                    <div className="flex gap-3 relative">

                                        {/* Box 1: Country Selector (Flag + Code + Arrow) */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                className="flex items-center justify-between py-2 px-3 border border-[#cccccc] rounded bg-white min-w-[110px] cursor-pointer hover:border-[#333333] transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ReactCountryFlag
                                                        countryCode={selectedCountry.code}
                                                        svg
                                                        style={{ width: "1.2em", height: "1.2em" }}
                                                    />
                                                    <span className="text-sm text-[#333333] font-medium">
                                                        {selectedCountry.dialCode}
                                                    </span>
                                                </div>
                                                <FaChevronDown size={10} color="#666666" className="ml-2" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {showCountryDropdown && (
                                                <div className="absolute top-full left-0 z-20 mt-1 w-72 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                                    {countries.map((country) => (
                                                        <button
                                                            key={country.code}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCountry(country);
                                                                setShowCountryDropdown(false);
                                                            }}
                                                            className={`flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-50 last:border-none ${selectedCountry.code === country.code ? "bg-purple-50" : ""
                                                                }`}
                                                        >
                                                            <span className="mr-3 flex shrink-0 w-6 items-center justify-center">
                                                                <ReactCountryFlag
                                                                    countryCode={country.code}
                                                                    svg
                                                                    style={{ width: "1.2em", height: "1.2em" }}
                                                                />
                                                            </span>
                                                            <span className="text-gray-500 w-10 shrink-0">{country.dialCode}</span>
                                                            <span className="flex-1 text-gray-700 truncate">{country.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Box 2: Phone Number Input */}
                                        <div className="flex-1">
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                className="w-full py-2 px-3 border border-[#cccccc] rounded text-sm text-[#333333] outline-none bg-white focus:border-[#333333] placeholder:text-gray-400"
                                                placeholder={selectedCountry.placeholder || "00000 00000"}
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-[13px] text-[#333333] mb-1.5">Password</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-[#666666] flex items-center"><FaLock color="#666666" /></div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="w-full py-2 pr-10 pl-10 border border-[#cccccc] rounded text-sm text-[#333333] outline-none bg-white focus:border-[#333333]"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button type="button" className="absolute right-3 bg-none border-none cursor-pointer p-1 flex items-center text-[#666666]" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash color="#666666" /> : <FaEye color="#666666" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-[13px] text-[#333333] mb-1.5">Confirm Password</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-[#666666] flex items-center"><FaLock color="#666666" /></div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirm_password"
                                            className="w-full py-2 pr-10 pl-10 border border-[#cccccc] rounded text-sm text-[#333333] outline-none bg-white focus:border-[#333333]"
                                            placeholder="Confirm Password"
                                            value={formData.confirm_password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button type="button" className="absolute right-3 bg-none border-none cursor-pointer p-1 flex items-center text-[#666666]" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <FaEyeSlash color="#666666" /> : <FaEye color="#666666" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center my-4">
                                    <label className="flex items-center cursor-pointer select-none">
                                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                                        <div className="mr-2 flex items-center">
                                            {rememberMe ? <FaCheckSquare color="#333333" /> : <FaSquare color="#cccccc" />}
                                        </div>
                                        <span className="text-[13px] text-[#333333]">I agree to the <a href="#" className="text-[#333333] font-semibold no-underline hover:underline">Terms & Conditions</a></span>
                                    </label>
                                </div>

                                {status.error && (
                                    <p className="text-sm text-red-500 mb-4 text-center">{status.error}</p>
                                )}

                                <button type="submit" disabled={status.loading} className="w-full p-3.5 bg-[#333333] text-white border-none rounded text-sm font-semibold cursor-pointer hover:bg-[#1a1a1a] transition-colors disabled:opacity-50">
                                    {status.loading ? 'Creating account...' : 'Sign Up'}
                                </button>
                            </form>

                            <div className="text-center mt-5 text-[13px] text-[#666666]">
                                Already have an account?
                                <Link to="/signin" className="text-[#333333] font-semibold ml-1 no-underline hover:underline">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
