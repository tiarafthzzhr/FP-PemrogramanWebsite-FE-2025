import { ArrowLeft, User } from "lucide-react";

interface MathGameNavbarProps {
  onExit: () => void;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  userName?: string;
}

export function MathGameNavbar({
  onExit,
  currentQuestion,
  totalQuestions,
  score,
  userName,
}: MathGameNavbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Exit Button - Always show text */}
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 text-sm shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Game</span>
          </button>

          {/* Right: Game Info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
            {/* Question Progress */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-gray-700 text-xs sm:text-sm">
                Q:
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm shadow-md">
                {currentQuestion}/{totalQuestions}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-gray-700 text-xs sm:text-sm">
                Score:
              </span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm shadow-md">
                {score}
              </span>
            </div>

            {/* User - Hidden on very small screens */}
            {userName && (
              <div className="hidden sm:flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
                <User className="w-4 h-4" />
                <span className="font-medium text-sm">{userName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
