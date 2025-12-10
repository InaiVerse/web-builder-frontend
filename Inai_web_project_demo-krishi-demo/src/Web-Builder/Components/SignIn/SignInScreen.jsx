// import React from "react";
// import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
// import { FaRegUserCircle } from "react-icons/fa";
// import { MdLockOutline } from "react-icons/md";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// const SignInScreen = ({ setStep, setEmail }) => {
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = React.useState(false);
//     const [formData, setFormData] = React.useState({
//         email: "",
//         password: ""
//     });

//     const [status, setStatus] = React.useState({
//         loading: false,
//         error: "",
//         success: ""
//     });

//     const handleInputChange = (e) => {
//         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setStatus({ loading: true, error: "", success: "" });

//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     email: formData.email.trim(),
//                     password: formData.password,
//                     login_method: "manual"
//                 })
//             });

//             const payload = await response.json();

//             if (!response.ok) {
//                 setStatus({
//                     loading: false,
//                     error: payload?.message || "Unable to sign in.",
//                     success: ""
//                 });
//                 return;
//             }

//             const authData = payload?.data;

//             if (authData) {
//                 Cookies.set("access_token", authData.access_token);
//                 Cookies.set("refresh_token", authData.refresh_token);
//                 Cookies.set("user_id", authData.user_id);
//                 Cookies.set("username", authData.username);
//                 Cookies.set("email", authData.email);
//             }

//             setStatus({
//                 loading: false,
//                 error: "",
//                 success: payload?.message
//             });

//             navigate('/dashboard');

//         } catch (err) {
//             setStatus({ loading: false, error: "Network error.", success: "" });
//         }
//     };

//     return (
//         <div className="min-h-screen w-full bg-black relative overflow-hidden px-4 py-8 flex items-center justify-center">

//             {/* BLUR BACKGROUND SAME AS ORIGINAL */}
//             <div className="absolute w-[500px] h-[500px] top-[-150px] left-[-200px] bg-pink-400/20 blur-[140px] rounded-full"></div>
//             <div className="absolute w-[500px] h-[500px] bottom-[-150px] right-[-200px] bg-purple-500/20 blur-[140px] rounded-full"></div>

//             <div className="relative z-10 w-11/12 mx-auto px-4">
//                 <div
//                     className="
//                         /* Mobile */
//                         max-w-md w-full bg-[#00000070] 
//                         backdrop-blur-lg rounded-2xl p-6 sm:p-8 
//                         flex flex-col gap-8

//                         /* Desktop */
//                         md:max-w-none md:w-11/12 md:p-0 
//                         md:bg-[#FFFFFF0A] md:backdrop-blur-md 
//                         md:grid md:grid-cols-[40%_60%] 
//                         md:gap-8 md:px-10 md:py-12
//                     "
//                 >

//                     {/* LEFT SECTION SAME AS SIGNIN */}
//                     <div
//                         className="
//                             flex flex-col flex-shrink-0
//                             text-white items-center text-center gap-4
//                             md:items-start md:text-left md:justify-around md:h-full
//                         "
//                     >
//                         <div className="flex flex-col items-center md:items-start gap-2">
//                             <img
//                                 src='../../Public/Logo.png'
//                                 className="w-24 h-24 md:w-[100px] md:h-[100px]"
//                             />

//                             <h1 className="text-3xl md:text-4xl font-bold leading-tight">
//                                 Your{" "}
//                                 <span className="bg-gradient-to-r from-[#FF9898] to-[#8054FF] bg-clip-text text-transparent">
//                                     Intelligence
//                                 </span>
//                                 <br /> Amplified
//                             </h1>
//                         </div>

//                         {/* Desktop only */}
//                         <p className="text-gray-300 text-sm mt-3 hidden md:block">
//                             Don’t have an account?{" "}
//                             <button
//                                 onClick={() => navigate('/signup')}
//                                 className="text-pink-400 font-medium cursor-pointer"
//                             >
//                                 Sign Up
//                             </button>
//                         </p>
//                     </div>

//                     {/* RIGHT SIDE FORM (EXACT SAME STYLING) */}
//                     <div className="w-full bg-transparent p-1 md:p-10">
//                         <form className="space-y-6" onSubmit={handleSubmit}>

//                             {/* Email */}
//                             <div>
//                                 <label className="block text-sm text-gray-300 mb-1">Email</label>

//                                 <div className="flex items-center bg-white/4 border border-[#262626] rounded-lg">
//                                     <span className="px-3 text-gray-400">
//                                         <FaRegUserCircle />
//                                     </span>

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

//                             {/* Password */}
//                             <div>
//                                 <label className="block text-sm text-gray-300 mb-1">Password</label>

//                                 <div className="flex items-center bg-white/4 border border-[#262626] rounded-lg">
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
//                                         className="px-3 text-gray-400 cursor-pointer"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                                     </button>
//                                 </div>

//                                 <div className="flex justify-end mt-1">
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setEmail(formData.email);
//                                             setStep(2);
//                                         }}
//                                         className="text-xs text-white cursor-pointer"
//                                     >
//                                         Forgot password?
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Errors */}
//                             {status.error && (
//                                 <p className="text-sm text-red-400">{status.error}</p>
//                             )}

//                             {/* Submit */}
//                             <button
//                                 type="submit"
//                                 disabled={status.loading}
//                                 className="w-full cursor-pointer bg-gradient-to-r from-[#FF9898] to-[#8054FF] text-white py-3 rounded-lg font-bold"
//                             >
//                                 {status.loading ? "Signing in…" : "Sign In"}
//                             </button>

//                             {/* OR Divider */}
//                             <div className="flex items-center justify-center my-4">
//                                 <div className="w-full border-t border-gray-600"></div>
//                                 <span className="px-3 text-sm text-gray-400">OR</span>
//                                 <div className="w-full border-t border-gray-600"></div>
//                             </div>

//                             {/* Google Login */}
//                             <button className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-2 rounded-lg">
//                                 <FaGoogle className="w-5 h-5" />
//                                 Sign in with Google
//                             </button>
//                         </form>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignInScreen;





























import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaApple, FaFacebookF, FaCheckSquare, FaSquare } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTypewriter } from 'react-simple-typewriter';
import logo from '../../assets/inai-black.png';
const SignInScreen = ({ setStep, setEmail }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    // Existing form state
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    // Existing status state
    const [status, setStatus] = useState({
        loading: false,
        error: "",
        success: ""
    });
    const [placeholderText] = useTypewriter({
        words: ['Example: "Explain quantum computing in simple terms"'],
        loop: true,
        typeSpeed: 50,
        deleteSpeed: 50,
        delaySpeed: 1000,
    });
    const handleInputChange = (e) => {
        // Map "username" input from new UI to "email" in state if necessary, 
        // but let's keep name="email" on the input for clarity with existing logic if possible.
        // However, user code had name="username". We will use name="email" to match our state
        // and just update the placeholder to say "Username or email".
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ loading: true, error: "", success: "" });
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password,
                    login_method: "manual"
                })
            });
            const payload = await response.json();
            if (!response.ok) {
                setStatus({
                    loading: false,
                    error: payload?.message || "Unable to sign in.",
                    success: ""
                });
                return;
            }
            const authData = payload?.data;
            if (authData) {
                Cookies.set("access_token", authData.access_token);
                Cookies.set("refresh_token", authData.refresh_token);
                Cookies.set("user_id", authData.user_id);
                Cookies.set("username", authData.username);
                Cookies.set("email", authData.email);
            }
            setStatus({
                loading: false,
                error: "",
                success: payload?.message
            });
            navigate('/dashboard');
        } catch (err) {
            setStatus({ loading: false, error: "Network error.", success: "" });
        }
    };
    const handleSocialLogin = (provider) => {
        console.log(`Login with ${provider}`);
        // Future implementation
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
                            {/* Corner Boxes of the inner white box */}
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -top-[7px] -left-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -top-[7px] -right-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -bottom-[7px] -left-[7px]"></div>
                            <div className="absolute w-[14px] h-[14px] bg-[#333333] -bottom-[7px] -right-[7px]"></div>
                            {/* Logo */}
                            <div className="text-center mb-20">
                                <img src={logo} alt="INAI WORLDS Logo" className="max-w-full h-auto max-h-[150px] object-contain" />
                            </div>
                            {/* Example Input */}
                            <div className="w-full max-w-[400px] relative">
                                <input
                                    type="text"
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
                    {/* Right Panel - Login Form */}
                    <div className="flex-1 flex items-center justify-center p-10 bg-[#F1F5F9]">
                        <div className="w-full max-w-[400px]">
                            <p className="text-sm text-[#666666] mb-4 text-center">Login with:</p>
                            {/* Social Login Buttons */}
                            <div className="flex gap-3 mb-6 flex-col sm:flex-row">
                                {['Google', 'Apple', 'Facebook'].map((provider) => (
                                    <button
                                        key={provider}
                                        type="button"
                                        onClick={() => handleSocialLogin(provider)}
                                        className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-white border border-[#cccccc] rounded cursor-pointer transition-all text-sm text-[#333333] hover:bg-[#f9f9f9] hover:border-[#333333]"
                                    >
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
                                    <label className="block text-[13px] text-[#333333] mb-1.5">Username or email</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-[#666666] flex items-center"><FaUser color="#666666" /></div>
                                        <input
                                            type="text"
                                            name="email"
                                            className="w-full py-3 pr-3 pl-10 border border-[#cccccc] rounded text-sm text-[#333333] outline-none bg-white focus:border-[#333333] transition-colors"
                                            placeholder="Username or email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[13px] text-[#333333] mb-1.5">Password</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-[#666666] flex items-center"><FaLock color="#666666" /></div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="w-full py-3 pr-10 pl-10 border border-[#cccccc] rounded text-sm text-[#333333] outline-none bg-white focus:border-[#333333] transition-colors"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 bg-none border-none cursor-pointer p-1 flex items-center text-[#666666]"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash color="#666666" /> : <FaEye color="#666666" />}
                                        </button>
                                    </div>
                                </div>
                                {/* Link to Forgot Password logic */}
                                <div className="text-right -mt-2 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmail(formData.email);
                                            setStep(2);
                                        }}
                                        className="text-xs text-[#666666] no-underline hover:text-[#333333] transition-colors bg-transparent border-none cursor-pointer"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="flex items-center my-4">
                                    <label className="flex items-center cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="hidden"
                                        />
                                        <div className="mr-2 flex items-center">
                                            {rememberMe ? <FaCheckSquare color="#333333" /> : <FaSquare color="#cccccc" />}
                                        </div>
                                        <span className="text-[13px] text-[#333333]">Remember Me</span>
                                    </label>
                                </div>
                                {/* Error Display */}
                                {status.error && (
                                    <p className="text-sm text-red-500 mb-4 text-center">{status.error}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="w-full p-3.5 bg-[#333333] text-white border-none rounded text-sm font-semibold cursor-pointer hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                                >
                                    {status.loading ? "Signing in..." : "Sign In"}
                                </button>
                            </form>
                            <div className="text-center mt-5 text-[13px] text-[#666666]">
                                Don't have an account?
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-[#333333] font-semibold ml-1 no-underline hover:underline bg-transparent border-none cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SignInScreen;