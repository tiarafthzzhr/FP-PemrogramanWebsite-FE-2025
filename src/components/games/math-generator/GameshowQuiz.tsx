import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";

interface GameshowQuizProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  userName?: string;
}

export function GameshowQuiz({
  questions,
  onComplete,
  onExit,
}: GameshowQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);

  const question = questions[currentQuestion];
  const letters = ["A", "B", "C", "D"];

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === question.answer;

    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  if (showResult) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 flex items-center justify-center p-4 relative">
        {/* Spotlights */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"
            animate={{
              x: ["-50%", "150%"],
              y: ["-50%", "150%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Trophy className="w-24 h-24 text-white mx-auto mb-4" />
          </motion.div>
          <h2 className="text-white mb-4">Spectacular!</h2>
          <div className="text-7xl mb-4 text-white">
            {score}/{questions.length}
          </div>
          <p className="text-white/90 mb-6">You're a Math Champion! 🎉</p>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-white text-purple-700 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "100%", "0%"],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: ["100%", "0%", "100%"],
            y: ["100%", "0%", "100%"],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h2 className="text-white">GAMESHOW QUIZ</h2>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
          <div className="flex justify-center gap-8 text-white">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              Question {currentQuestion + 1}/{questions.length}
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              Score: {score}
            </div>
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-xl"
              >
                🔥 Streak: {streak}
              </motion.div>
            )}
          </div>
        </div>

        {/* Question Board */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-2xl transform -rotate-1">
              <div className="bg-purple-900 rounded-2xl p-8 transform rotate-1">
                <h3 className="text-white text-7xl text-center">
                  {question.display}
                </h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer Boards */}
        <div className="grid grid-cols-2 gap-6">
          {question.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.answer;
            const showResult = selectedAnswer !== null;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl text-3xl transition-all transform hover:scale-105 ${
                  showResult && isCorrect
                    ? "bg-gradient-to-br from-green-400 to-green-600 text-white scale-110"
                    : showResult && isSelected && !isCorrect
                      ? "bg-gradient-to-br from-red-400 to-red-600 text-white"
                      : "bg-gradient-to-br from-white to-gray-100 text-purple-900 hover:from-yellow-200 hover:to-yellow-300"
                }`}
                whileHover={!showResult ? { y: -5 } : {}}
                whileTap={!showResult ? { scale: 0.95 } : {}}
              >
                {/* Letter Badge */}
                <div
                  className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    showResult && isCorrect
                      ? "bg-green-600 text-white"
                      : showResult && isSelected
                        ? "bg-red-600 text-white"
                        : "bg-purple-600 text-white"
                  }`}
                >
                  {letters[index]}
                </div>

                {/* Answer */}
                <div className="pt-8">{option}</div>

                {/* Result Indicator */}
                {showResult && isCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-4xl"
                  >
                    ✓
                  </motion.div>
                )}
                {showResult && isSelected && !isCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-4xl"
                  >
                    ✗
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
