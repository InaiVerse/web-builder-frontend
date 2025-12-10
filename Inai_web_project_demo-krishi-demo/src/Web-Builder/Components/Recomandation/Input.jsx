import { useEffect, useRef, useState } from 'react';
import LogoWhite from '@/Web-Builder/assets/Logo-White.png';
import { IoSend, IoMic, IoMicOff } from "react-icons/io5";
import Form1 from './Form1';
import Cookies from "js-cookie";
import { getProjectData, setProjectData } from '../Utils/projectStorage';

function Input() {
  const username = Cookies.get("username") || "Guest";
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const stored = getProjectData();
    if (stored?.prompt) {
      setPrompt(stored.prompt);
    }
    if (stored?.questions?.length) {
      setApiResponse({ questions: stored.questions });
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      if (transcript) {
        setPrompt((prev) => {
          if (!prev) return transcript;
          const separator = prev.endsWith(" ") ? "" : " ";
          return `${prev}${separator}${transcript}`.trim();
        });
      }
    };

    recognitionRef.current = recognition;
    setIsSpeechSupported(true);

    return () => {
      recognition.stop();
    };
  }, []);

  const handleToggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } catch (error) {
      console.error("Speech recognition start/stop error:", error);
    }
  };

  // API CALL FUNCTION
  const handleSend = async (e) => {
    e.preventDefault();

    if (!prompt.trim() || isLoading) return alert("Please enter a prompt");

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/generate-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      setApiResponse(data);
      setProjectData({
        prompt: prompt.trim(),
        questions: data?.questions || []
      });
      setPrompt("");

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If response exists → show Form1
  if (apiResponse) {
    return <Form1 questions={apiResponse.questions} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden app-background px-0 pb-8 sm:px-10 md:px-16">

      {/* BG Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2B1132] via-[#0F0C29] to-[#302B63]" />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, rgba(255, 177, 155, 0.4), transparent 55%), radial-gradient(circle at 80% 20%, rgba(129, 110, 254, 0.35), transparent 60%), radial-gradient(circle at 50% 90%, rgba(30, 70, 255, 0.25), transparent 65%)",
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-30 lg:items-stretch">

        {/* ===== DESKTOP HEADER (unchanged) ===== */}
        <header className="hidden sm:flex items-center justify-between py-7">
          <img src={LogoWhite} alt="Logo" />

          <div className="flex cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] px-4 py-2 shadow-lg shadow-[#6f2bff40]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-semibold">{username?.[0]?.toUpperCase()}</span>
            </span>
            <div className="text-sm font-medium">{username}</div>
          </div>
        </header>

        {/* ===== MOBILE HEADER (matches screenshot) ===== */}
        <header className="flex sm:hidden items-center justify-between px-4 pt-6">
          <img src={LogoWhite} alt="Logo" className="h-10" />

          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] px-3 py-1.5 shadow-md shadow-[#6f2bff40]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-semibold">{username?.[0]?.toUpperCase()}</span>
            </span>
            <div className="text-xs font-medium">{username}</div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex flex-1 flex-col items-center text-center mt-10 sm:mt-0">

          {/* Title + Subtitle */}
          <div className="space-y-3 mt-16 sm:mt-0 px-4">
            <h1 className="text-[32px] sm:text-5xl font-semibold text-white">
              Welcome to INAI
            </h1>
            <p className="text-sm sm:text-lg text-white/60">
              Just describe your idea. We'll build it for you
            </p>
          </div>

          {/* --- PROMPT BOX (Mobile Optimized) --- */}
          <div className="w-full px-4 mt-10 sm:mt-12 max-w-xl mx-auto">
            <form className="rounded-3xl bg-black/50 px-5 py-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.75)] border border-white/10 backdrop-blur">

              {/* Input + Send */}
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder='Example: "Explain quantum computing in simple terms"'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full text-sm md:text-base bg-transparent outline-none text-white placeholder-white/50"
                />

                <button
                  type="submit"
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`ml-2 cursor-pointer flex h-10 w-10 items-center justify-center rounded-md ${isLoading ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-white transition`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  ) : (
                    <IoSend size={18} />
                  )}
                </button>
              </div>

              {/* Attach + Plus Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                >
                  +
                </button>

                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-white/70 hover:bg-white/10 transition text-sm"
                >
                  Attach
                </button>

                <button
                  type="button"
                  onClick={handleToggleListening}
                  disabled={!isSpeechSupported}
                  aria-pressed={isListening}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                    isListening
                      ? 'border-white bg-white/20 text-[#0F0C29]'
                      : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                  title={
                    isSpeechSupported
                      ? (isListening ? 'Listening… Click to stop' : 'Use microphone')
                      : 'Speech recognition not supported in this browser'
                  }
                >
                  {isListening ? <IoMicOff className="h-4 w-4" /> : <IoMic className="h-4 w-4" />}
                </button>
              </div>

            </form>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Input;
