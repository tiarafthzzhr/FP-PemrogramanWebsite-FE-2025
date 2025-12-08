import { useNavigate, useParams } from "react-router-dom";
import { CategoryBuckets } from "./components/CategoryBuckets";
import { CountdownScreen } from "./components/CountdownScreen";
import { GameEndScreen } from "./components/GameEndScreen";
import { GameHeader } from "./components/GameHeader";
import { StartScreen } from "./components/StartScreen";
import { WordCardsAnimation } from "./components/WordCardsAnimation";
import { useGetPlaySpeedSorting } from "./hooks/useGetPlaySpeedSorting";
import {
  getScrollAnimation,
  useSpeedSortingGame,
} from "./hooks/useSpeedSortingGame";

export default function SpeedSorting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: detail, isLoading, error } = useGetPlaySpeedSorting(id!);

  const game = useSpeedSortingGame(detail);
  const scrollAnimation = getScrollAnimation();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error || !detail)
    return (
      <div className="flex justify-center items-center min-h-screen">
        {error || "Game not found"}
      </div>
    );

  if (game.gameEnded) {
    return (
      <>
        <style>{scrollAnimation}</style>
        <GameEndScreen
          finalTime={game.finalTime}
          totalWords={game.totalWords}
          incorrectAttempts={game.incorrectAttempts}
          onPlayAgain={game.resetGame}
          onBackToHome={() => (window.location.href = "/")}
        />
      </>
    );
  }

  return (
    <>
      <style>{scrollAnimation}</style>
      <div className="relative w-full min-h-screen bg-[#050816] text-slate-100 flex flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.14), transparent 35%), radial-gradient(circle at 80% 10%, rgba(139,92,246,0.18), transparent 30%), radial-gradient(circle at 50% 80%, rgba(14,165,233,0.14), transparent 30%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(45,212,191,0.05) 0%,rgba(139,92,246,0.05) 50%,rgba(6,182,212,0.05) 100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-[#050816] via-[#050816]/90 to-transparent" />

        <GameHeader
          timer={game.timer}
          score={game.score}
          onExit={() => navigate(-1)}
        />

        <div className="relative w-full flex-1 p-2 sm:p-4 lg:p-6 flex justify-center items-center">
          <div className="w-full max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="relative overflow-hidden bg-[#050816]/92 w-full p-4 sm:p-8 lg:p-12 text-center space-y-6 sm:space-y-8 lg:space-y-10 rounded-xl lg:rounded-2xl border border-cyan-400/20 shadow-[0_20px_80px_-40px_rgba(0,255,255,0.6)] min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex flex-col justify-center backdrop-blur-xl">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, rgba(59,130,246,0.12) 0%, rgba(16,185,129,0.1) 50%, rgba(236,72,153,0.1) 100%)",
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#050816] via-[#050816]/85 to-transparent" />
              {game.gameState === "waiting" && (
                <StartScreen
                  onStart={game.startGame}
                  title={detail.name}
                  thumbnailImage={`${import.meta.env.VITE_API_URL}/${detail.thumbnail_image}`}
                />
              )}

              {game.gameState === "countdown" && (
                <CountdownScreen countdown={game.countdown} />
              )}

              {game.gameState === "playing" && (
                <>
                  <WordCardsAnimation
                    words={game.words}
                    speed={game.speed}
                    draggedItem={game.draggedItem}
                    onDragStart={game.handleDragStart}
                    onDragEnd={game.handleDragEnd}
                  />

                  <CategoryBuckets
                    categories={game.categories}
                    hoveredCategory={game.hoveredCategory}
                    dropFeedback={game.dropFeedback}
                    onDragOver={game.handleDragOver}
                    onDragEnter={game.handleDragEnter}
                    onDragLeave={game.handleDragLeave}
                    onDrop={game.handleDrop}
                  />

                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-200 drop-shadow-[0_0_14px_rgba(34,211,238,0.55)] mt-4 sm:mt-6 lg:mt-8">
                    <div className="w-full h-px bg-linear-to-r from-transparent via-cyan-400/80 to-transparent mb-4" />
                    {game.completedWords} of {game.totalWords} words completed
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
