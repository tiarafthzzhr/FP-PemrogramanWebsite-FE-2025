import { Button } from "@/components/ui/button";

interface StartScreenProps {
  onStart: () => void;
  title: string;
  thumbnailImage: string;
}

export function StartScreen({
  onStart,
  title,
  thumbnailImage,
}: StartScreenProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 space-y-5 sm:space-y-7 lg:space-y-8 text-slate-100">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_45%)]" />
      <div className="relative flex flex-col items-center gap-3 sm:gap-5">
        <div className="px-4 py-2 rounded-full border border-cyan-400/40 bg-white/5 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
          Speed Sorting
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-[0_10px_40px_rgba(59,130,246,0.35)]">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl text-center px-4">
          Drag each neon card into its matching category. Beat the clock, and
          climb the score, enjoy the game!
        </p>
      </div>

      {thumbnailImage && (
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-4 blur-3xl bg-cyan-500/12 rounded-2xl" />
          <img
            src={thumbnailImage}
            alt={title}
            className="relative w-full h-40 sm:h-52 lg:h-60 object-cover rounded-2xl border border-cyan-400/30 shadow-[0_25px_90px_-40px_rgba(59,130,246,0.9)]"
          />
        </div>
      )}

      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <Button
          onClick={onStart}
          size="lg"
          className="px-9 sm:px-11 py-3.5 sm:py-4 text-lg sm:text-xl font-semibold bg-linear-to-r from-cyan-500 via-indigo-500 to-emerald-500 text-white shadow-[0_18px_70px_-28px_rgba(59,130,246,0.95)] hover:scale-[1.03] transition-transform"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
}
