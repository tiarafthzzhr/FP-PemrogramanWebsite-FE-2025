import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";
import { getTheme } from "../../../lib/themes";

interface WhackAMoleProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  theme?: string;
  userName?: string;
}

interface Mole {
  id: number;
  answer: number;
  isCorrect: boolean;
  isVisible: boolean;
}

export function WhackAMole({
  questions,
  onComplete,
  onExit,
  theme = "default",
}: WhackAMoleProps) {
  const themeConfig = getTheme(theme);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const question = questions[currentQuestion];

  useEffect(() => {
    // Initialize moles
    const initialMoles: Mole[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      answer: 0,
      isCorrect: false,
      isVisible: false,
    }));
    setMoles(initialMoles);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || !question) return;

    // Spawn moles randomly
    const spawnInterval = setInterval(() => {
      const visibleCount = moles.filter((m) => m.isVisible).length;
      if (visibleCount < 3) {
        const availableHoles = moles.filter((m) => !m.isVisible);
        if (availableHoles.length > 0) {
          const randomHole =
            availableHoles[Math.floor(Math.random() * availableHoles.length)];
          const isCorrect = Math.random() > 0.5;

          const newAnswer = isCorrect
            ? question.answer
            : question.options?.[
                Math.floor(Math.random() * question.options.length)
              ] || question.answer;

          setMoles(
            moles.map((m) =>
              m.id === randomHole.id
                ? { ...m, answer: newAnswer, isCorrect, isVisible: true }
                : m,
            ),
          );

          // Hide mole after 1.5 seconds
          setTimeout(() => {
            setMoles((prevMoles) =>
              prevMoles.map((m) =>
                m.id === randomHole.id ? { ...m, isVisible: false } : m,
              ),
            );
          }, 1500);
        }
      }
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [moles, question, gameOver]);

  const handleWhack = (mole: Mole) => {
    if (!mole.isVisible || gameOver) return;

    if (mole.isCorrect) {
      setScore(score + 1);

      // Move to next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }

    // Hide the mole immediately
    setMoles(
      moles.map((m) => (m.id === mole.id ? { ...m, isVisible: false } : m)),
    );
  };

  if (gameOver) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">Time's Up!</h2>
          <div className="text-6xl mb-4 font-bold">{score}</div>
          <p className="text-gray-600 mb-6">Correct moles whacked!</p>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Generator
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex flex-col relative ${themeConfig.fontFamily || "font-sans"}`}
    >
      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-3">
        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-white mb-2 text-2xl font-extrabold drop-shadow-md">
            🔨 Whack-a-Mole
          </h2>
          <div
            className={`${themeConfig.cardBg} backdrop-blur ${themeConfig.cardShape} p-3 mb-2 shadow-xl border-b-4 ${themeConfig.cardBorder}`}
          >
            <h3
              className={`mb-1 text-xs ${themeConfig.secondaryText} font-bold uppercase tracking-wider`}
            >
              Target
            </h3>
            <div className={`text-4xl font-black ${themeConfig.primaryText}`}>
              {question?.display}
            </div>
          </div>
          <div className="flex justify-between items-center text-white bg-black/20 p-2 rounded-xl backdrop-blur-sm text-sm">
            <div className="text-center">
              <div className="text-xs opacity-80">Time</div>
              <div className="text-2xl font-bold font-mono">{timeLeft}s</div>
            </div>
            <div className="text-center">
              <div className="text-xs opacity-80">Score</div>
              <div className="text-2xl font-bold font-mono">{score}</div>
            </div>
          </div>
        </div>

        {/* Mole Grid */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          {moles.map((mole) => (
            <div key={mole.id} className="aspect-square relative group">
              {/* Background Hole & Grass */}
              <div className="w-full h-full bg-[#4ade80] rounded-3xl shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)] border-b-8 border-[#166534] relative overflow-hidden">
                {/* The Hole */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-black/40 rounded-[100%] blur-sm" />
                <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-4/5 h-2/5 bg-[#3f2e19] rounded-[50%]" />

                {/* The Mole Character */}
                <AnimatePresence>
                  {mole.isVisible && (
                    <motion.div
                      initial={{ y: "150%" }}
                      animate={{ y: "10%" }}
                      exit={{ y: "150%" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute inset-0 flex flex-col items-center justify-end pb-2 cursor-pointer z-10"
                      onClick={() => handleWhack(mole)}
                      whileTap={{ scale: 0.9, y: "20%" }}
                    >
                      {/* Body Shape */}
                      <div
                        className={`w-3/4 h-[85%] rounded-t-[40px] rounded-b-[20px] shadow-xl relative flex flex-col items-center pt-4 border-4 border-black/5 ${
                          mole.isCorrect
                            ? "bg-gradient-to-b from-amber-500 to-amber-700"
                            : "bg-gradient-to-b from-gray-400 to-gray-600"
                        }`}
                      >
                        {/* Face / Emoji */}
                        <div className="text-5xl drop-shadow-md z-20 mb-1">
                          {mole.isCorrect ? "🐹" : "🐭"}
                        </div>

                        {/* Answer Badge (White Box) */}
                        <div className="bg-white w-4/5 py-2 rounded-xl shadow-lg flex items-center justify-center mt-1 border-b-4 border-slate-200 z-20">
                          <span className="text-4xl font-black text-slate-900 tracking-tight">
                            {mole.answer}
                          </span>
                        </div>

                        {/* Little Hands (Decoration) */}
                        <div className="absolute top-20 -left-2 w-4 h-8 bg-inherit rounded-full -rotate-45" />
                        <div className="absolute top-20 -right-2 w-4 h-8 bg-inherit rounded-full rotate-45" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
