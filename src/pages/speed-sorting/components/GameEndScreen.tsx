import { Button } from "@/components/ui/button";
import { formatTime } from "../hooks/useSpeedSortingGame";

interface GameEndScreenProps {
  finalTime: number;
  totalWords: number;
  incorrectAttempts: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export function GameEndScreen({
  finalTime,
  totalWords,
  incorrectAttempts,
  onPlayAgain,
  onBackToHome,
}: GameEndScreenProps) {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#050816] text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_45%)]" />
      <div className="relative bg-white/5 p-10 sm:p-12 rounded-2xl border border-cyan-400/30 shadow-[0_30px_120px_-60px_rgba(59,130,246,0.9)] text-center max-w-md w-full mx-4 backdrop-blur-2xl">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-cyan-100 mb-3">
          Mission Complete
        </h1>
        <p className="text-base sm:text-lg text-slate-300 mb-8">
          You conquered the Speed Sorting grid. Ready to rerun the simulation?
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-cyan-500/10 border border-cyan-400/40 p-4 rounded-lg shadow-[0_10px_50px_-30px_rgba(34,211,238,0.8)]">
            <div className="text-2xl font-bold text-cyan-100">
              {formatTime(finalTime)}
            </div>
            <div className="text-sm text-cyan-200/80">Total Time</div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-400/40 p-4 rounded-lg shadow-[0_10px_50px_-30px_rgba(16,185,129,0.8)]">
            <div className="text-2xl font-bold text-emerald-100">
              {totalWords}
            </div>
            <div className="text-sm text-emerald-200/80">Words Completed</div>
          </div>

          <div className="bg-rose-500/10 border border-rose-400/40 p-4 rounded-lg shadow-[0_10px_50px_-30px_rgba(244,63,94,0.8)]">
            <div className="text-2xl font-bold text-rose-100">
              {incorrectAttempts}
            </div>
            <div className="text-sm text-rose-200/80">Incorrect Attempts</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-linear-to-r from-cyan-500 via-indigo-500 to-emerald-500 text-white border-0 shadow-[0_15px_60px_-25px_rgba(59,130,246,0.9)] hover:scale-[1.01] transition-transform"
            size="lg"
          >
            Play Again
          </Button>
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full border-cyan-300/60 bg-white/5 text-cyan-50 hover:bg-cyan-500/15 hover:text-white"
            size="lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
