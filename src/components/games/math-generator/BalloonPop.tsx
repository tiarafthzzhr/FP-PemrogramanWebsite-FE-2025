import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";

interface BalloonPopProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  userName?: string;
}

interface Balloon {
  id: string;
  answer: number;
  isCorrect: boolean;
  x: number;
  y: number;
  color: string;
  speed: number;
}

export function BalloonPop({ questions, onComplete, onExit }: BalloonPopProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [poppedBalloon, setPoppedBalloon] = useState<string | null>(null);

  const question = questions[currentQuestion];
  const colors = [
    "from-red-400 to-red-600",
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
  ];

  useEffect(() => {
    if (!question) return;

    // Create balloons for current question
    const newBalloons: Balloon[] =
      question.options?.map((option, i) => ({
        id: `${currentQuestion}-${i}`,
        answer: option,
        isCorrect: option === question.answer,
        x: 15 + i * 20,
        y: 100,
        color: colors[i % colors.length],
        speed: 0.5 + Math.random() * 0.5,
      })) || [];

    setBalloons(newBalloons);
  }, [currentQuestion, question]);

  useEffect(() => {
    if (showResult) return;

    // Animate balloons floating up
    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((balloon) => ({
          ...balloon,
          y: balloon.y - balloon.speed,
          x: balloon.x + Math.sin(balloon.y / 20) * 0.5,
        })),
      );
    }, 50);

    return () => clearInterval(interval);
  }, [showResult]);

  const handleBalloonPop = (balloon: Balloon) => {
    if (poppedBalloon) return;

    setPoppedBalloon(balloon.id);

    if (balloon.isCorrect) {
      setScore(score + 1);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setPoppedBalloon(null);
        } else {
          setShowResult(true);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setPoppedBalloon(null);
      }, 1000);
    }
  };

  if (showResult) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">All Balloons Popped!</h2>
          <div className="text-6xl mb-4">
            {score}/{questions.length}
          </div>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl"
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 relative flex flex-col">
      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      {/* Header */}
      <div className="relative z-20 text-center pt-4 pb-2">
        <h2 className="text-white mb-2 text-2xl font-bold">Balloon Pop 🎈</h2>
        <div className="bg-white rounded-2xl p-4 max-w-md mx-auto mb-2">
          <h3 className="mb-1 text-sm">Pop the balloon with:</h3>
          <div className="text-4xl font-black">{question?.display}</div>
        </div>
        <div className="flex justify-center gap-4 text-white text-sm">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            \n Question {currentQuestion + 1}/{questions.length}\n{" "}
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Balloons */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              className="absolute cursor-pointer"
              style={{
                left: `${balloon.x}%`,
                top: `${balloon.y}%`,
              }}
              onClick={() => handleBalloonPop(balloon)}
              whileHover={{ scale: 1.1 }}
            >
              {poppedBalloon === balloon.id ? (
                // Popped balloon animation
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 0, opacity: 0 }}
                  className="relative"
                >
                  <div className="text-6xl">💥</div>
                </motion.div>
              ) : (
                // Floating balloon
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  {/* Balloon */}
                  <div
                    className={`w-24 h-28 bg-gradient-to-br ${balloon.color} rounded-full relative shadow-2xl`}
                  >
                    {/* Shine */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white/40 rounded-full" />

                    {/* Answer */}
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                      {balloon.answer}
                    </div>

                    {/* Balloon knot */}
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-current"
                      style={{
                        color: balloon.color.includes("red")
                          ? "#dc2626"
                          : balloon.color.includes("blue")
                            ? "#2563eb"
                            : balloon.color.includes("green")
                              ? "#16a34a"
                              : balloon.color.includes("yellow")
                                ? "#ca8a04"
                                : balloon.color.includes("purple")
                                  ? "#9333ea"
                                  : "#ec4899",
                      }}
                    />
                  </div>

                  {/* String */}
                  <div className="w-0.5 h-32 bg-gray-400 mx-auto" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ground indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />
    </div>
  );
}
