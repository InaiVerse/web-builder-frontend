import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SignOtp = () => {
    const location = useLocation();
    const emailFromSignup = location.state?.email ?? 'user@example.com';

    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const inputRefs = useRef([]);
    const [timer, setTimer] = useState(20);
    const [status, setStatus] = useState({ error: '', success: '' });
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (timer <= 0) {
            return;
        }

        const countdown = setInterval(() => {
            setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);

        return () => clearInterval(countdown);
    }, [timer]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const nextValues = [...otpValues];
        nextValues[index] = value;
        setOtpValues(nextValues);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === 'ArrowRight' && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpValues.length);

        if (!pasted) {
            return;
        }

        const nextValues = [...otpValues];
        pasted.split('').forEach((digit, idx) => {
            nextValues[idx] = digit;
        });
        setOtpValues(nextValues);

        const nextIndex = Math.min(pasted.length, otpValues.length) - 1;
        if (nextIndex >= 0) {
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleResend = () => {
        if (timer > 0) {
            return;
        }

        setOtpValues(['', '', '', '']);
        setTimer(20);
        setStatus({ error: '', success: 'We have sent a new code to your email.' });
        inputRefs.current[0]?.focus();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (otpValues.some((digit) => digit === '')) {
            setStatus({ error: 'Please enter the 4-digit verification code.', success: '' });
            return;
        }

        setStatus({ error: '', success: '' });
        setIsVerifying(true);

        setTimeout(() => {
            setIsVerifying(false);
            setStatus({ error: '', success: 'OTP verified successfully.' });
        }, 800);
    };

    const formattedTimer = timer.toString().padStart(2, '0');
    const verifyDisabled = isVerifying || otpValues.some((digit) => digit === '');

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden p-4">
            <div
                className="absolute w-[570px] h-[570px] rounded-full bg-linear-to-br from-[#F292A3] to-transparent filter blur-3xl opacity-15"
                style={{
                    left: 'calc(50% - 570px/2 - 660px)',
                    top: 'calc(50% - 570px/2 - 210px)'
                }}
            ></div>
            <div
                className="absolute w-[570px] h-[570px] rounded-full bg-linear-to-r from-[#8054FF] to-transparent filter blur-3xl opacity-15"
                style={{
                    left: 'calc(50% - 570px/2 + 660px)',
                    top: 'calc(50% - 570px/2 + 210px)'
                }}
            ></div>

            <div className="relative z-10 w-full max-w-5xl">
                <div className="bg-[#FFFFFF0A] backdrop-blur-md rounded-2xl grid md:grid-cols-[40%_60%] overflow-hidden shadow-2xl border border-white/5">
                    <div className="bg-black/40 px-8 py-8 flex flex-col justify-between text-center md:text-left items-center md:items-start">
                        <div>
                            <div className="w-[100px] h-[100px] mb-8 mx-auto md:mx-0">
                                <img src="../../Public/Logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                                Verify Your
                                <br />
                                <span className="bg-linear-to-r from-[#FF9898] to-[#8054FF] bg-clip-text text-transparent">Phone </span>
                                Number
                            </h1>
                            <p className="text-gray-300/80 mt-6 text-sm md:text-base max-w-xs">
                                Enter the one-time password sent to your email address to secure your account.
                            </p>
                        </div>
                        <div className="md:block text-xs text-gray-500 mt-10">
                            <p>Didn&apos;t receive the code? Check your spam folder or request a new one after the timer ends.</p>
                        </div>
                    </div>

                    <div className="px-8 py-12 md:px-12">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-white">Enter code</h2>
                            <p className="text-sm text-gray-400 mt-3">
                                We&apos;ve sent an OTP with activation code to your email <span className="text-white/80 font-medium">{emailFromSignup}</span>
                            </p>
                        </div>

                        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
                            <div className="flex justify-center gap-4">
                                {otpValues.map((value, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        className="w-14 h-14 md:w-16 md:h-16 bg-white/5 border border-[#262626] rounded-xl text-center text-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#8054FF] focus:border-transparent"
                                        value={value}
                                        onChange={(event) => handleChange(index, event.target.value)}
                                        onKeyDown={(event) => handleKeyDown(index, event)}
                                        onPaste={handlePaste}
                                        onFocus={(event) => event.target.select()}
                                        ref={(element) => {
                                            inputRefs.current[index] = element;
                                        }}
                                        aria-label={`OTP digit ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <div className="text-center text-sm text-gray-400">
                                {timer > 0 ? (
                                    <span>
                                        Send code again in <span className="text-white/80 font-medium">00:{formattedTimer}</span>
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="text-white font-medium hover:text-[#FF9898] transition-colors"
                                    >
                                        Resend code
                                    </button>
                                )}
                            </div>

                            {status.error && <p className="text-center text-sm text-red-400">{status.error}</p>}
                            {status.success && <p className="text-center text-sm text-emerald-400">{status.success}</p>}

                            <button
                                type="submit"
                                disabled={verifyDisabled}
                                className={`w-full bg-linear-to-r from-[#FF9898] to-[#8054FF] text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed ${isVerifying ? 'cursor-progress' : ''}`}
                            >
                                {isVerifying ? 'Verifying…' : 'Verify'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignOtp;
