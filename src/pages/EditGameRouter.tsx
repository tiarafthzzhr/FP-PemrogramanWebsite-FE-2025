import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import toast from "react-hot-toast";

// Import both edit components
import EditQuiz from "./EditQuiz";
import EditMathGenerator from "./EditMathGenerator";

export default function EditGameRouter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectGameType = async () => {
      if (!id) {
        toast.error("Game ID not found");
        navigate("/my-projects");
        return;
      }

      try {
        setLoading(true);

        // Try to fetch as quiz first
        try {
          const quizRes = await api.get(`/api/game/game-type/quiz/${id}`);
          if (quizRes.data.success) {
            setGameType("quiz");
            return;
          }
        } catch (quizError: unknown) {
          // If 404, try math-generator
          if (
            quizError &&
            typeof quizError === "object" &&
            "response" in quizError &&
            (quizError as { response?: { status?: number } }).response
              ?.status === 404
          ) {
            try {
              const mathRes = await api.get(
                `/api/game/game-type/math-generator/${id}`,
              );
              if (mathRes.data.success) {
                setGameType("math-generator");
                return;
              }
            } catch {
              // Both failed
            }
          }
        }

        // If both failed
        toast.error("Game not found");
        navigate("/my-projects");
      } catch (error: unknown) {
        console.error("Error detecting game type:", error);
        toast.error("Failed to load game");
        navigate("/my-projects");
      } finally {
        setLoading(false);
      }
    };

    detectGameType();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  // Render appropriate edit component based on game type
  if (gameType === "quiz") {
    return <EditQuiz />;
  }

  if (gameType === "math-generator") {
    return <EditMathGenerator />;
  }

  return null;
}
