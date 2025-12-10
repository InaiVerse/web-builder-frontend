import React from "react";
import { FaRegEnvelope } from "react-icons/fa";

const ForgotPasswordScreen = ({ setStep, setEmail }) => {
    const [emailLocal, setEmailLocal] = React.useState("");
    const [status, setStatus] = React.useState({ message: "", type: "" });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailLocal.trim()) {
            setStatus({ message: "Please enter a valid email.", type: "error" });
            return;
        }

        setStatus({ message: "", type: "" });
        setEmail(emailLocal.trim());
        setStep(3);
    };

    return (
        <div className="min-h-screen w-full bg-black relative overflow-hidden px-4 py-8 flex items-center justify-center">

            <div className="absolute w-[500px] h-[500px] top-[-150px] left-[-200px] bg-pink-400/20 blur-[140px] rounded-full"></div>
            <div className="absolute w-[500px] h-[500px] bottom-[-150px] right-[-200px] bg-purple-500/20 blur-[140px] rounded-full"></div>

            <div
                className="
                    hidden md:block
                    absolute 
                    left-1/2 top-1/2 
                    -translate-x-1/2 -translate-y-1/2

                    w-[95%]
                    md:w-[85%]
                    lg:w-[75%]
                    xl:w-[65%]
                    2xl:w-[80%]

                    min-h-[590px]    
                    max-h-[85vh] 

                    bg-[rgba(255,255,255,0.03)]
                    backdrop-blur-xl 
                    rounded-2xl 
                    border border-white/5
                    p-6 md:p-10
                "
            ></div>


            <div
                className="
                    relative z-20 
                    w-full max-w-md 

                    bg-[#00000070] backdrop-blur-lg      
                    md:bg-transparent md:backdrop-blur-none 

                    rounded-2xl 
                    p-6 sm:p-8 
                    flex flex-col gap-7
                "
            >
                <div className="flex flex-col items-center gap-3">
                    <img
                        src='../../Public/Logo.png'
                        alt="INAI"
                        className="w-24 h-24"
                    />

                    <h1 className="text-3xl font-bold text-white leading-tight text-center">
                        Forgot{" "}
                        <span className="bg-gradient-to-r from-[#FF9898] to-[#8054FF] bg-clip-text text-transparent">
                            Password?
                        </span>
                    </h1>

                    <p className="text-white/70 text-sm text-center mt-1">
                        Enter your registered email and we’ll send you a code.
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Email</label>

                        <div className="flex items-center bg-white/4 border border-[#262626] rounded-lg">
                            <span className="px-3 text-gray-400">
                                <FaRegEnvelope />
                            </span>

                            <input
                                type="email"
                                value={emailLocal}
                                onChange={(e) => setEmailLocal(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-transparent text-white py-2 px-2"
                                required
                            />
                        </div>
                    </div>

                    {/* ERROR */}
                    {status.message && (
                        <p className="text-sm text-red-400 text-center">
                            {status.message}
                        </p>
                    )}

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-gradient-to-r from-[#FF9898] to-[#8054FF] text-white py-3 rounded-lg font-bold"
                    >
                        Send Code
                    </button>

                    {/* BACK */}
                    <div className="text-gray-300 text-sm mt-3 hidden md:block text-center">
                        Remember your password?{" "}
                        <button
                            onClick={() => setStep(1)}
                            className="text-pink-400 font-medium cursor-pointer"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
