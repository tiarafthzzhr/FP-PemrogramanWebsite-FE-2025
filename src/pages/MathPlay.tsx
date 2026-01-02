import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Typography } from "@/components/ui/typography";
import { playMathGeneratorPublic } from "@/api/mathGenerator/playMathGenerator";
import { updatePlayCount } from "@/api/game/updatePlayCount";
import { useAuthStore } from "@/store/useAuthStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Game Components
import { Quiz } from "@/components/games/math-generator/Quiz";
import { MatchUp } from "@/components/games/math-generator/MatchUp";
import { TrueOrFalse } from "@/components/games/math-generator/TrueOrFalse";
import { FindTheMatch } from "@/components/games/math-generator/FindTheMatch";
import { WhackAMole } from "@/components/games/math-generator/WhackAMole";
import { GameshowQuiz } from "@/components/games/math-generator/GameshowQuiz";
import { BalloonPop } from "@/components/games/math-generator/BalloonPop";
import { MazeChase } from "@/components/games/math-generator/MazeChase";
import { RankOrder } from "@/components/games/math-generator/RankOrder";
import { Airplane } from "@/components/games/math-generator/Airplane";

// Import types
import type {
  MathQuestion as GameMathQuestion,
  GameSettings,
} from "@/types/game";

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

export default function MathPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<MathGameData | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to play games");
      navigate("/login");
      return;
    }

    const fetchGame = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await playMathGeneratorPublic(id);
        setGame(response.data);

        // Update play count (don't await, let it run in background)
        try {
          await updatePlayCount(id);
        } catch (err) {
          console.log("Failed to update play count:", err);
        }
      } catch (err: unknown) {
        console.error("Failed to load math game:", err);
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(
          error.response?.data?.message || "Failed to load math game.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, navigate, user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-slate-50">
        <Typography variant="h3">Loading game...</Typography>
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
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Transform API questions to game component format
  // API returns: { index, question, options: (number|string)[] }
  // Components need: { question, answer: number, options?: number[], display: string }

  // Parse question to extract the actual math expression and calculate answer
  const transformedQuestions: GameMathQuestion[] = game.questions.map((q) => {
    const options = q.options.map((opt) =>
      typeof opt === "string" ? parseFloat(opt) : opt,
    );

    // Try to calculate the correct answer from the question
    // Question format is like "5 + 3" or "10 - 2"
    let correctAnswer = options[0]; // fallback to first option

    try {
      // Parse the question to find the operation and calculate
      const questionText = q.question.trim();
      const match = questionText.match(/(\d+)\s*([+\-*/×÷])\s*(\d+)/);

      if (match) {
        const num1 = parseInt(match[1]);
        const operator = match[2];
        const num2 = parseInt(match[3]);

        switch (operator) {
          case "+":
            correctAnswer = num1 + num2;
            break;
          case "-":
            correctAnswer = num1 - num2;
            break;
          case "*":
          case "×":
            correctAnswer = num1 * num2;
            break;
          case "/":
          case "÷":
            correctAnswer = num1 / num2;
            break;
        }
      }
    } catch {
      console.warn("Failed to calculate answer for:", q.question);
    }

    return {
      question: q.question,
      answer: correctAnswer,
      options: options,
      display: q.question, // Just use the question itself, no need to add " = ?"
    };
  });

  const gameSettings: GameSettings = {
    operation: game.settings.operation,
    difficulty: game.settings.difficulty,
    questionCount: game.settings.question_count,
  };

  // Get game_type from settings or root level
  const gameType = game.settings.game_type || game.game_type || "quiz";
  const theme = game.settings.theme || "default";

  console.log("🎮 Game Type:", gameType);
  console.log("📦 Transformed Questions:", transformedQuestions);

  const handleComplete = () => {
    toast.success("🎉 Game completed!");
    navigate("/");
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    navigate("/");
  };

  // Render appropriate game component based on game type
  return (
    <>
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit? Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmExit}
            >
              Yes, Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full min-h-screen">
        {(() => {
          const gameProps = {
            questions: transformedQuestions,
            settings: gameSettings,
            theme: theme,
            onComplete: handleComplete,
            onExit: handleExit,
            userName: user?.username || user?.email || "Player",
          };

          switch (gameType) {
            case "quiz":
              return <Quiz {...gameProps} />;
            case "truefalse":
              return <TrueOrFalse {...gameProps} />;
            case "matchup":
              return <MatchUp {...gameProps} />;
            case "findthematch":
            case "findmatch":
              return <FindTheMatch {...gameProps} />;
            case "whackamole":
              return <WhackAMole {...gameProps} />;
            case "gameshowquiz":
            case "gameshow":
              return <GameshowQuiz {...gameProps} />;
            case "balloonpop":
            case "balloon":
              return <BalloonPop {...gameProps} />;
            case "mazechase":
            case "maze":
              return <MazeChase {...gameProps} />;
            case "rankorder":
              return <RankOrder {...gameProps} />;
            case "airplane":
              return <Airplane {...gameProps} />;
            default:
              return <Quiz {...gameProps} />;
          }
        })()}
      </div>
    </>
  );
}
