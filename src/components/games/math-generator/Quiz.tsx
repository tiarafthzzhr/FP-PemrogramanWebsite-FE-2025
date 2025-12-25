import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";
import { getTheme } from "../../../lib/themes";
import { MathGameNavbar } from "./MathGameNavbar";
import { ConfettiEffect } from "./ConfettiEffect";
import { BackgroundMusic } from "./BackgroundMusic";

interface QuizProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  theme?: string;
  userName?: string;
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Quiz({
  questions,
  onComplete,
  onExit,
  theme = "default",
}: QuizProps) {
  const themeConfig = getTheme(theme);

  // Shuffle questions once on mount
  const shuffledQuestions = useMemo(() => shuffleArray(questions), [questions]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Shuffle options for current question
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([]);

  const question = shuffledQuestions[currentQuestion];

  useEffect(() => {
    // Shuffle options when question changes
    if (question.options) {
      setShuffledOptions(shuffleArray(question.options));
    }
  }, [currentQuestion, question.options]);

  const handleAnswerClick = (answer: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const isPerfectScore = score === questions.length;

    return (
      <>
        <BackgroundMusic autoPlay={true} />
        {isPerfectScore && <ConfettiEffect />}
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
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.6,
            }}
            className={`${themeConfig.cardBg} ${themeConfig.cardShape} ${themeConfig.cardBorder} ${themeConfig.fontFamily || "font-sans"} p-6 sm:p-8 max-w-md w-full mx-2 text-center shadow-2xl relative z-10`}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <motion.h2
              className={`mb-4 text-2xl sm:text-3xl font-bold ${themeConfig.primaryText}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Quiz Complete!
            </motion.h2>
            <motion.div
              className={`text-5xl sm:text-6xl mb-4 font-bold ${themeConfig.primaryText}`}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {score}/{questions.length}
            </motion.div>
            <motion.p
              className={`${themeConfig.secondaryText} mb-6 text-base sm:text-lg`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {score === questions.length
                ? "Perfect score! 🎉"
                : score >= questions.length * 0.7
                  ? "Great job! 👏"
                  : "Keep practicing! 💪"}
            </motion.p>
            <motion.button
              onClick={onComplete}
              className={`w-full py-3 px-6 ${themeConfig.buttonBg} ${themeConfig.buttonHover} text-white ${themeConfig.buttonShape} font-semibold text-base sm:text-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
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

      {/* Math Game Navbar */}
      {onExit && (
        <MathGameNavbar
          onExit={onExit}
          currentQuestion={currentQuestion + 1}
          totalQuestions={shuffledQuestions.length}
          score={score}
        />
      )}

      <div
        className="min-h-screen flex items-center justify-center p-4 pt-20 relative"
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
        <div className="max-w-4xl w-full relative z-10 px-2 sm:px-4">
          {/* Progress Bar - Removed since info is in navbar */}

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3,
              }}
              className={`${themeConfig.cardBg} ${themeConfig.cardShape} ${themeConfig.cardBorder} ${themeConfig.fontFamily || "font-sans"} p-4 sm:p-6 md:p-8 shadow-2xl`}
            >
              <motion.div
                className="text-center mb-6 sm:mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2
                  className={`text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 ${themeConfig.primaryText} font-bold`}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  {question.display}
                </motion.h2>
                <p
                  className={`${themeConfig.secondaryText} text-sm sm:text-base`}
                >
                  Select the correct answer
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                {shuffledOptions.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectAnswer = option === question.answer;
                  const showCorrect =
                    selectedAnswer !== null && isCorrectAnswer;
                  const showWrong = isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerClick(option)}
                      disabled={selectedAnswer !== null}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{
                        scale: selectedAnswer === null ? 1.05 : 1,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 sm:p-6 ${themeConfig.optionShape} text-xl sm:text-2xl font-semibold transition-all ${
                        showCorrect
                          ? `${themeConfig.correctColor} text-white shadow-lg`
                          : showWrong
                            ? `${themeConfig.wrongColor} text-white shadow-lg`
                            : isSelected
                              ? `${themeConfig.optionBg} ${themeConfig.optionBorder} ${themeConfig.optionText || themeConfig.primaryText}`
                              : `${themeConfig.optionBg} ${themeConfig.optionHoverBg} ${themeConfig.optionBorder} ${themeConfig.optionText || themeConfig.primaryText} hover:shadow-md`
                      }`}
                    >
                      <motion.div
                        className="flex items-center justify-center gap-2"
                        animate={
                          showCorrect || showWrong ? { scale: [1, 1.1, 1] } : {}
                        }
                        transition={{ duration: 0.3 }}
                      >
                        {option}
                        {showCorrect && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 10,
                            }}
                          >
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.div>
                        )}
                        {showWrong && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                          >
                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.button
                    onClick={handleNext}
                    className={`w-full py-4 px-6 ${themeConfig.buttonBg} ${themeConfig.buttonHover} text-white ${themeConfig.buttonShape} flex items-center justify-center gap-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Next Question <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        See Results <Trophy className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
