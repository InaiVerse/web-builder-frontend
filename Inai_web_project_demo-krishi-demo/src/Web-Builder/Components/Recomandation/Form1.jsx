import { useEffect, useState } from "react";
import LogoWhite from '@/Web-Builder/assets/Logo-White.png';
import Avatar from '../../assets/INAI.png';
import Theme from './Theme';
import Cookies from "js-cookie";
import { getProjectData, setProjectData } from '../Utils/projectStorage';

function Form1({ questions = [] }) {
  const username = Cookies.get("username") || "Guest";
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const hasAnswerValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  useEffect(() => {
    const stored = getProjectData();
    if (typeof stored.currentQuestionIndex === 'number') {
      const lastIndex = Math.min(
        stored.currentQuestionIndex,
        Math.max(questions.length - 1, 0)
      );
      setIndex(lastIndex);
    }
    if (stored.answers) {
      setAnswers(stored.answers);
    }
    if (stored.formCompleted) {
      setIsCompleted(true);
    }
  }, [questions.length]);

  const question = questions[index];

  if (isCompleted) {
    return <Theme answers={answers} questions={questions} />;
  }

  if (!question)
    return <h1 className="text-white text-3xl p-10">No Questions Found</h1>;

  const currentAnswer = answers[question.id];
  const isRequiredPhase = index < 4;
  const isContinueDisabled = isRequiredPhase && !hasAnswerValue(currentAnswer);

  const handleNext = () => {
    if (isRequiredPhase && !hasAnswerValue(currentAnswer)) {
      alert("Please answer this question before continuing.");
      return;
    }
    if (index < questions.length - 1) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setProjectData({ currentQuestionIndex: nextIndex, formCompleted: false });
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      const prevIndex = index - 1;
      setIndex(prevIndex);
      setProjectData({ currentQuestionIndex: prevIndex });
    }
  };

  const handleFinish = () => {
    setIsCompleted(true);
    setProjectData({ formCompleted: true, currentQuestionIndex: index, answers });
  };

  const handleAnswer = (id, value) => {
    const updatedAnswers = { ...answers, [id]: value };
    setAnswers(updatedAnswers);
    setProjectData({ answers: updatedAnswers, formCompleted: false });
  };

  // DESKTOP original UI unchanged
  const renderDesktopInput = (q) => {
    if (q.type === "text") {
      return (
        <input
          className="w-full bg-white/10 border border-white/20 rounded-md text-white p-2 mt-3"
          placeholder={q.placeholder || ""}
          value={answers[q.id] || ""}
          onChange={(e) => handleAnswer(q.id, e.target.value)}
        />
      );
    }

    if (q.type === "yes_no") {
      return (
        <div className="flex gap-4 mt-4">
          {["Yes", "No"].map((opt) => {
            const selected = answers[q.id] === opt;
            return (
              <div
                key={opt}
                onClick={() => handleAnswer(q.id, opt)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer
              ${selected
                    ? "bg-white text-black font-semibold"
                    : "bg-white/10 text-white/80 border border-white/30"} 
            `}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 
                ${selected ? "bg-black border-black" : "border-white"}`}
                />
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
      );
    }


    if (q.type === "select") {
      return (
        <select
          className="w-full bg-white/10 border border-white/20 rounded-md text-black p-2 mt-3"
          value={answers[q.id] || ""}
          onChange={(e) => handleAnswer(q.id, e.target.value)}
        >
          <option value="">Select an option</option>
          {q.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen overflow-hidden app-background px-0 pb-8 sm:px-10 md:px-16">

      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2B1132] via-[#0F0C29] to-[#302B63]" />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, rgba(255, 177, 155, 0.4), transparent 55%), radial-gradient(circle at 80% 20%, rgba(129, 110, 254, 0.35), transparent 60%), radial-gradient(circle at 50% 90%, rgba(30, 70, 255, 0.25), transparent 65%)",
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col">

        {/* DESKTOP HEADER (unchanged) */}
        <header className="hidden sm:flex items-center justify-between py-7">
          <img src={LogoWhite} alt="Logo" />
          <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] px-4 py-2 shadow-lg shadow-[#6f2bff40]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-semibold cursor-pointer">
                {username?.[0]?.toUpperCase()}
              </span>
            </span>
            <div className="text-sm font-medium cursor-pointer">{username}</div>
          </div>
        </header>

        {/* MOBILE HEADER */}
        <header className="flex sm:hidden items-center justify-between px-4 py-6">
          <img src={LogoWhite} alt="Logo" className="h-10" />
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] px-3 py-1.5 shadow-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-semibold">
                {username?.[0]?.toUpperCase()}
              </span>
            </span>
            <div className="text-xs font-medium">{username}</div>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <main className="flex flex-1 flex-col gap-12 lg:flex-row lg:items-center justify-center min-h-[80vh]">

          {/* LEFT */}
          <section className="flex flex-1 flex-col px-4 sm:px-0">

            {/* Progress */}
            <p className="text-white text-sm">
              Question {index + 1} of {questions.length}
            </p>

            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{
                  width: `${((index + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Title */}
            <h1 className="text-[22px] sm:text-3xl font-semibold text-white mt-10">
              {question.text}
            </h1>

            {/* MOBILE BUTTON OPTIONS */}
            {/* MOBILE VIEW */}
            <div className="mt-6 sm:hidden">
              {/* If options exist -> show buttons */}
              {question.options?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {question.options.map((opt) => {
                    const selected = answers[question.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(question.id, opt)}
                        className={`px-4 py-2 rounded-md border text-sm transition
              ${selected
                            ? "bg-gradient-to-r from-[#f85084] via-[#ee68cb] to-[#6f2bff] text-white border-transparent"
                            : "bg-black/20 text-white border-white/20"
                          }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* If no options -> show desktop input on mobile */
                <div className="mt-4">
                  {renderDesktopInput(question)}
                </div>
              )}
            </div>


            {/* DESKTOP ORIGINAL INPUT */}
            <div className="hidden sm:block mt-6">
              {renderDesktopInput(question)}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between items-center mt-14 mb-10">
              <button
                onClick={handlePrev}
                disabled={index === 0}
                className={`text-white/70 text-sm ${index === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                Previous
              </button>

              <button
                onClick={index === questions.length - 1 ? handleFinish : handleNext}
                disabled={isContinueDisabled}
                className={`px-6 py-2 bg-white text-black rounded-md font-medium shadow-lg ${isContinueDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                Continue
              </button>
            </div>

          </section>

          {/* RIGHT AVATAR — hidden on mobile */}
          <section className="hidden sm:flex flex-1 items-center justify-center">
            <img src={Avatar} className="h-[350px]" alt="avatar" />
          </section>

        </main>
      </div>
    </div>
  );
}

export default Form1;
