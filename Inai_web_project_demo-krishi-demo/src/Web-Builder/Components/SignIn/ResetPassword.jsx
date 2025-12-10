import React from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const ResetPassword = ({ setStep, email }) => {

    const [form, setForm] = React.useState({ password: '', confirm: '' });
    const [showPass, setShowPass] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [status, setStatus] = React.useState({ type: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.password.trim() || !form.confirm.trim()) {
            setStatus({ type: 'error', message: 'Please fill both fields.' });
            return;
        }

        if (form.password !== form.confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setStatus({ type: 'success', message: 'Password reset successful.' });

        setTimeout(() => setStep(1), 600);
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
                <div className="flex flex-col items-center gap-3 text-center">
                    {/* LOGO */}
                    <img
                        src='../../Public/Logo.png'
                        alt="INAI"
                        className="h-20 w-auto mx-auto mb-6"
                    />

                    {/* HEADING */}
                    <h1 className="text-3xl md:text-4xl font-semibold text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8ba3] to-[#8054FF]">
                            Set a new
                        </span>{" "}
                        Password
                    </h1>

                    <p className="text-white/70 text-sm md:text-base max-w-md mx-auto mt-3">Please type something you’ll remember</p>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-6">

                    {/* NEW PASSWORD */}
                    <div className="text-left">
                        <label className="text-white/70 text-sm">New Password</label>

                        <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 mt-2">
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="New password"
                                className="w-full bg-transparent text-white focus:outline-none"
                            />
                            <button type="button" className="text-white/60 cursor-pointer" onClick={() => setShowPass(p => !p)}>
                                {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="text-left">
                        <label className="text-white/70 text-sm">Confirm Password</label>

                        <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 mt-2">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={form.confirm}
                                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                placeholder="Confirm password"
                                className="w-full bg-transparent text-white focus:outline-none"
                            />
                            <button type="button" className="text-white/60 cursor-pointer" onClick={() => setShowConfirm(p => !p)}>
                                {showConfirm ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>

                    {status.message && (
                        <p className={`text-sm text-center ${status.type === 'error' ? 'text-[#ff9898]' : 'text-green-400'}`}>
                            {status.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-gradient-to-r from-[#FF9898] to-[#8054FF] py-3 rounded-xl text-white font-semibold"
                    >
                        Reset Password
                    </button>

                </form>

            </div>
        </div>
    );
};

export default ResetPassword;
