/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as Progress from "@radix-ui/react-progress";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Trophy } from "lucide-react";
import { playMathGeneratorPrivate } from "@/api/mathGenerator/playMathGenerator";
import { checkMathAnswers } from "@/api/mathGenerator/checkMathAnswers";
import { getTheme } from "@/lib/themes";

interface MathQuestion {
  index: number;
  question: string;
  options: (number | string)[];
}

interface MathGameData {
  id: string;
  name: string;
  description: string;
  thumbnail_image: string;
  settings: {
    operation: string;
    difficulty: string;
    theme: string;
    question_count: number;
    game_type?: string;
  };
  game_type?: string; // Can be at root or in settings
  score_per_question: number;
  questions: MathQuestion[];
}

export default function MathPlayPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<MathGameData | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [userAnswers, setUserAnswers] = useState<
    { question_index: number; selected_answer: string }[]
  >([]);

  const [finished, setFinished] = useState(false);

  const [result, setResult] = useState<{
    score: number;
    correct_count: number;
    max_score: number;
  } | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await playMathGeneratorPrivate(id);
        setGame(response.data);
      } catch (err: any) {
        console.error("Failed to load math game:", err);
        toast.error(err.response?.data?.message || "Failed to load math game.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-slate-50">
        <Typography variant="h3">Loading game preview...</Typography>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-slate-50">
        <div className="text-center">
          <Typography variant="h3" className="mb-4">
            Game not found
          </Typography>
          <Button onClick={() => navigate("/my-projects")}>
            Back to My Projects
          </Button>
        </div>
      </div>
    );
  }

  const questions = game.questions;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const theme = getTheme(game.settings.theme);

  // Get game_type from settings or root level
  const gameType = game.settings.game_type || game.game_type || "quiz";
  console.log("🎮 Preview Game Type:", gameType);

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const updatedAnswers = [
      ...userAnswers,
      {
        question_index: questions[currentQuestion].index,
        selected_answer: selectedAnswer,
      },
    ];

    setUserAnswers(updatedAnswers);

    if (!isLastQuestion) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleFinish(updatedAnswers);
    }
  };

  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(null);
    }
  };

  const handleFinish = async (answers: typeof userAnswers) => {
    if (!id) return;

    try {
      toast.loading("Checking answers...");

      const response = await checkMathAnswers(id, answers);

      toast.dismiss();

      setResult({
        score: response.data.score,
        correct_count: response.data.correct_count,
        max_score: response.data.max_score,
      });
      setFinished(true);
    } catch (err: any) {
      toast.dismiss();
      console.error("Failed to submit answers:", err);
      toast.error(err.response?.data?.message || "Failed to submit answers.");
    }
  };

  if (finished && result) {
    const percentage = result.score;
    const isPerfect = percentage === 100;
    const isGood = percentage >= 70;
    const isFail = percentage < 50;

    return (
      <div
        className={`w-full min-h-screen flex flex-col items-center justify-center p-8 ${theme.background}`}
        style={{
          backgroundImage: theme.backgroundImage
            ? `url('${theme.backgroundImage}')`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className={theme.backgroundOverlay || ""}
          style={{ position: "absolute", inset: 0 }}
        />

        <div
          className={`relative z-10 max-w-2xl w-full ${theme.cardBg} ${theme.cardShape} p-8 shadow-2xl border ${theme.cardBorder}`}
        >
          <div className="text-center space-y-6">
            {/* Preview Badge */}
            <div className="flex justify-center mb-4">
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                🔒 Preview Mode (Unpublished)
              </span>
            </div>

            {/* Trophy Icon */}
            <div className="flex justify-center">
              <div
                className={`w-24 h-24 ${isPerfect ? "bg-yellow-400" : isGood ? "bg-blue-400" : "bg-gray-400"} rounded-full flex items-center justify-center`}
              >
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <Typography
              variant="h1"
              className={`text-4xl font-bold ${theme.primaryText}`}
            >
              {isPerfect
                ? "Perfect Score! 🎉"
                : isGood
                  ? "Great Job! 👏"
                  : isFail
                    ? "Keep Practicing! 💪"
                    : "Good Effort! 👍"}
            </Typography>

            {/* Score */}
            <div className="space-y-2">
              <Typography
                variant="h2"
                className={`text-6xl font-bold ${theme.primaryText}`}
              >
                {percentage.toFixed(1)}%
              </Typography>
              <Typography variant="p" className={theme.secondaryText}>
                {result.correct_count} out of {questions.length} correct
              </Typography>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-6">
              <div
                className={`p-4 ${theme.optionBg} ${theme.optionShape} border ${theme.optionBorder}`}
              >
                <Typography variant="muted" className="text-sm">
                  Correct Answers
                </Typography>
                <Typography
                  variant="h3"
                  className={`text-2xl font-bold ${theme.primaryText}`}
                >
                  {result.correct_count}
                </Typography>
              </div>
              <div
                className={`p-4 ${theme.optionBg} ${theme.optionShape} border ${theme.optionBorder}`}
              >
                <Typography variant="muted" className="text-sm">
                  Total Score
                </Typography>
                <Typography
                  variant="h3"
                  className={`text-2xl font-bold ${theme.primaryText}`}
                >
                  {Math.round((percentage / 100) * result.max_score)}
                </Typography>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate(`/quiz/edit/${id}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Edit
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className={`${theme.buttonBg} ${theme.buttonHover} ${theme.buttonText}`}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen flex flex-col ${theme.background}`}
      style={{
        backgroundImage: theme.backgroundImage
          ? `url('${theme.backgroundImage}')`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className={theme.backgroundOverlay || ""}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Header */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/quiz/edit/${id}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Preview
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Typography variant="h3" className="text-xl font-bold">
                    {game.name}
                  </Typography>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    Preview
                  </span>
                </div>
                <Typography variant="muted" className="text-sm">
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${theme.optionBg} ${theme.primaryText}`}
              >
                {game.settings.difficulty.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress.Root
            className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2 mt-4"
            value={progress}
          >
            <Progress.Indicator
              className={`${theme.progressFill} w-full h-full transition-transform duration-300 ease-in-out`}
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </div>
      </div>

      {/* Question Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8">
        <div
          className={`max-w-3xl w-full ${theme.cardBg} ${theme.cardShape} p-8 shadow-2xl border ${theme.cardBorder} ${theme.fontFamily || "font-sans"}`}
        >
          {/* Question */}
          <div className="text-center mb-8">
            <Typography
              variant="muted"
              className={`text-sm mb-3 ${theme.secondaryText}`}
            >
              {gameType === "truefalse" && "✅❌ "}
              {gameType === "whackamole" && "🔨 "}
              {gameType === "balloonpop" && "🎈 "}
              {gameType === "airplane" && "✈️ "}
              {gameType === "gameshowquiz" && "🎬 "}
              {gameType === "mazechase" && "🏃 "}
              {gameType === "matchup" && "🧩 "}
              {gameType === "findthematch" && "🔍 "}
              {gameType === "rankorder" && "🏆 "}
              Solve the problem
            </Typography>
            <Typography
              variant="h1"
              className={`text-6xl font-bold mb-6 ${theme.primaryText}`}
            >
              {questions[currentQuestion].question} = ?
            </Typography>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {questions[currentQuestion].options.map((option, idx) => {
              const isSelected = selectedAnswer === String(option);

              // Add subtle game-specific styling
              let extraClasses = "";
              let iconPrefix = "";

              if (gameType === "whackamole") {
                extraClasses = "hover:shadow-xl";
              } else if (gameType === "balloonpop") {
                iconPrefix = "🎈 ";
              } else if (gameType === "truefalse") {
                extraClasses = "rounded-2xl";
              } else if (gameType === "airplane") {
                iconPrefix = "✈️ ";
              } else if (gameType === "gameshowquiz") {
                extraClasses = "shadow-xl";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(String(option))}
                  className={`${theme.optionBg} ${theme.optionShape} border-2 ${
                    isSelected
                      ? `${theme.optionBorder.replace("border-", "border-4 border-")} ${theme.correctColor.replace("bg-", "bg-")}/20`
                      : theme.optionBorder
                  } ${theme.optionHoverBg} p-6 text-center text-3xl font-bold ${theme.optionText || theme.primaryText} transition-all cursor-pointer hover:scale-105 ${extraClasses}`}
                >
                  {iconPrefix}
                  {option}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstQuestion}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`${theme.buttonBg} ${theme.buttonHover} ${theme.buttonShape} ${theme.buttonText} px-8`}
            >
              {isLastQuestion ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
