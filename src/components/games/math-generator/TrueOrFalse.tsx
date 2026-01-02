import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";
import { getTheme } from "../../../lib/themes";
import { BackgroundMusic } from "./BackgroundMusic";

interface TrueOrFalseProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  theme?: string;
  userName?: string;
}

interface TFQuestion {
  equation: string;
  isCorrect: boolean;
  correctAnswer: number;
  shownAnswer: number;
}

export function TrueOrFalse({
  questions,
  onComplete,
  onExit,
  theme = "default",
}: TrueOrFalseProps) {
  const themeConfig = getTheme(theme);
  const [tfQuestions] = useState<TFQuestion[]>(() => {
    return questions.map((q) => {
      const isCorrect = Math.random() > 0.5;
      const shownAnswer = isCorrect
        ? q.answer
        : q.answer + (Math.floor(Math.random() * 6) - 3);

      return {
        equation: `${q.display} = ${shownAnswer}`,
        isCorrect,
        correctAnswer: q.answer,
        shownAnswer,
      };
    });
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = tfQuestions[currentQuestion];

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    if (answer === question.isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < tfQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <>
        <BackgroundMusic autoPlay={true} />
        <div
          className="h-screen overflow-hidden flex items-center justify-center p-4 relative"
          style={{
            backgroundImage: themeConfig.backgroundImage
              ? `url('${themeConfig.backgroundImage}')`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {themeConfig.backgroundOverlay && (
            <div
              className={`absolute inset-0 ${themeConfig.backgroundOverlay}`}
            />
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`${themeConfig.cardBg} ${themeConfig.cardShape} ${themeConfig.cardBorder} ${themeConfig.fontFamily || "font-sans"} p-8 max-w-md w-full text-center shadow-2xl relative z-10`}
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            <h2 className={`mb-4 ${themeConfig.primaryText}`}>
              Game Complete!
            </h2>
            <div className={`text-6xl mb-4 ${themeConfig.primaryText}`}>
              {score}/{tfQuestions.length}
            </div>
            <motion.button
              onClick={onComplete}
              className={`w-full py-3 px-6 ${themeConfig.buttonBg} ${themeConfig.buttonHover} text-white ${themeConfig.buttonShape}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Generator
            </motion.button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackgroundMusic autoPlay={true} />
      <div
        className="h-screen overflow-hidden flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: themeConfig.backgroundImage
            ? `url('${themeConfig.backgroundImage}')`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
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

        {themeConfig.backgroundOverlay && (
          <div
            className={`absolute inset-0 ${themeConfig.backgroundOverlay}`}
          />
        )}
        <div className="max-w-2xl w-full relative z-10">
          {/* Progress */}
          <div className="mb-6">
            <div
              className={`flex justify-between ${themeConfig.primaryText} mb-2 text-sm font-semibold`}
            >
              <span>
                📊 Question {currentQuestion + 1}/{tfQuestions.length}
              </span>
              <span>⭐ Score: {score}</span>
            </div>
            <div
              className={`h-2 ${themeConfig.progressBg} rounded-full overflow-hidden`}
            >
              <motion.div
                className={`h-full ${themeConfig.progressFill}`}
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestion + 1) / tfQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${themeConfig.cardBg} ${themeConfig.cardShape} ${themeConfig.cardBorder} ${themeConfig.fontFamily || "font-sans"} p-8 shadow-2xl text-center`}
            >
              <h3
                className={`${themeConfig.secondaryText} mb-4 text-lg font-semibold`}
              >
                Is this correct?
              </h3>
              <div
                className={`text-5xl md:text-6xl mb-8 font-bold ${themeConfig.primaryText}`}
              >
                {question.equation}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => handleAnswer(true)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 ${themeConfig.optionShape} text-xl font-bold transition-all ${
                    selectedAnswer === true
                      ? question.isCorrect
                        ? "bg-green-500 text-white border-4 border-green-600"
                        : "bg-red-500 text-white border-4 border-red-600"
                      : selectedAnswer === false && question.isCorrect
                        ? "bg-green-100 border-2 border-green-400 text-green-700"
                        : "bg-green-100 hover:bg-green-200 border-2 border-green-300 text-green-700 hover:border-green-500"
                  }`}
                  whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                >
                  {selectedAnswer === true &&
                    (question.isCorrect ? (
                      <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    ) : (
                      <XCircle className="w-12 h-12 mx-auto mb-2" />
                    ))}
                  <div className="text-4xl mb-2">✔️</div>
                  <div>TRUE</div>
                </motion.button>

                <motion.button
                  onClick={() => handleAnswer(false)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 ${themeConfig.optionShape} text-xl font-bold transition-all ${
                    selectedAnswer === false
                      ? !question.isCorrect
                        ? "bg-green-500 text-white border-4 border-green-600"
                        : "bg-red-500 text-white border-4 border-red-600"
                      : selectedAnswer === true && !question.isCorrect
                        ? "bg-green-100 border-2 border-green-400 text-green-700"
                        : "bg-red-100 hover:bg-red-200 border-2 border-red-300 text-red-700 hover:border-red-500"
                  }`}
                  whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                >
                  {selectedAnswer === false &&
                    (!question.isCorrect ? (
                      <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    ) : (
                      <XCircle className="w-12 h-12 mx-auto mb-2" />
                    ))}
                  <div className="text-4xl mb-2">❌</div>
                  <div>FALSE</div>
                </motion.button>
              </div>

              {/* Feedback */}
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl font-semibold ${
                    (selectedAnswer === true && question.isCorrect) ||
                    (selectedAnswer === false && !question.isCorrect)
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {(selectedAnswer === true && question.isCorrect) ||
                  (selectedAnswer === false && !question.isCorrect) ? (
                    <>✅ Correct! The answer is {question.correctAnswer}</>
                  ) : (
                    <>
                      ❌ Wrong! The correct answer is {question.correctAnswer}
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
