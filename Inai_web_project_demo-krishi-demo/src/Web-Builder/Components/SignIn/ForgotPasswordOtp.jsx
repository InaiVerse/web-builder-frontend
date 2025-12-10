import React from 'react';

const OTP_LENGTH = 4;
const OTP_TIMER = 30;

const ForgotPasswordOtp = ({ setStep, email }) => {

    const [otpValues, setOtpValues] = React.useState(Array(OTP_LENGTH).fill(''));
    const inputRefs = React.useRef([]);
    const [timer, setTimer] = React.useState(OTP_TIMER);
    const [status, setStatus] = React.useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Timer
    React.useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);

    }, [timer]);

    // Input Handling
    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const next = [...otpValues];
        next[index] = value;
        setOtpValues(next);

        if (value && index < OTP_LENGTH - 1)
            inputRefs.current[index + 1]?.focus();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (otpValues.includes('')) {
            setStatus({ type: 'error', message: 'Enter complete OTP.' });
            return;
        }

        setStatus({ type: '', message: '' });
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);

            // Go to Reset Password
            setStep(4);

        }, 600);
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

                    bg-[#00000070] backdrop-blur-lg      
                    md:bg-transparent md:backdrop-blur-none 

                    rounded-2xl 
                    p-6 sm:p-8 
                    flex flex-col gap-7
                "
            >
                <div className="flex flex-col items-center gap-3 text-center">
                    <img
                        src='../../Public/Logo.png'
                        alt="INAI"
                        className="h-20 w-auto mx-auto mb-6"
                    />
                    <h1 className="text-3xl md:text-4xl font-semibold text-white">
                        Please Check Your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8ba3] to-[#8054FF]">
                            Email
                        </span>
                    </h1>

                    <p className="text-white/70 text-sm md:text-base max-w-md mx-auto mt-3">We’ve sent a code to {email}</p>

                    <form onSubmit={handleSubmit} className="mt-10 space-y-5 max-w-lg mx-auto">

                        <div className="flex justify-center gap-4">
                            {otpValues.map((value, i) => (
                                <input
                                    key={i}
                                    ref={el => inputRefs.current[i] = el}
                                    type="text"
                                    maxLength={1}
                                    value={value}
                                    onChange={e => handleChange(i, e.target.value)}
                                    className="h-14 w-14 text-center text-2xl font-bold text-white bg-white/10 border border-white/20 rounded-xl"
                                />
                            ))}
                        </div>

                        <div className="text-sm text-white/60">
                            {timer > 0 ? (
                                <>Send code again <span className="text-white cursor-pointer">{timer}s</span></>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpValues(Array(OTP_LENGTH).fill(''));
                                        setTimer(OTP_TIMER);
                                    }}
                                    className="text-[#ff9ccb]"
                                >
                                    Resend code
                                </button>
                            )}
                        </div>

                        {status.message && (
                            <p className={`text-sm ${status.type === 'error' ? 'text-[#ff9898]' : 'text-green-400'}`}>
                                {status.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-gradient-to-r from-[#FF9898] to-[#8054FF] py-3 rounded-xl text-white font-semibold"
                        >
                            {isSubmitting ? "Verifying…" : "Verify OTP"}
                        </button>

                    </form>

                </div>

            </div>
        </div>
    );
};

export default ForgotPasswordOtp;