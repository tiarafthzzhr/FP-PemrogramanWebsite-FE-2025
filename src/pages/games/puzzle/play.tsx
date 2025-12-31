import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Trophy, Pause, Play, RotateCcw, Timer } from "lucide-react";
import api from "@/api/axios";
import confetti from "canvas-confetti";

interface PuzzlePiece {
  id: number;
  correct_position: number;
  current_position: number;
}

interface PuzzleData {
  id: string;
  name: string;
  description: string;
  thumbnail_image: string;
  puzzle_image: string;
  difficulty: string;
  grid_size: number;
  time_limit?: number;
  max_moves?: number;
  pieces: PuzzlePiece[];
  is_published: boolean;
}

interface GameResult {
  game_id: string;
  is_complete: boolean;
  moves_count: number;
  time_taken: number;
  total_pieces: number;
  score: number;
}

interface PlayPuzzleProps {
  isPreview?: boolean;
}

function PlayPuzzle({ isPreview = false }: PlayPuzzleProps) {
  const { game_id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);

  // Fetch puzzle data
  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        setLoading(true);
        const endpoint = isPreview
          ? `/api/game/game-type/puzzle/${game_id}/play/private`
          : `/api/game/game-type/puzzle/${game_id}/play/public`;

        const response = await api.get(endpoint);
        const data = response.data.data;
        setPuzzle(data);

        // Load image to get aspect ratio
        const img = new Image();
        img.src = `${import.meta.env.VITE_API_URL}/${data.puzzle_image}`;
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          setImageAspectRatio(ratio);
        };

        // ASSEMBLY MODE: Initialize all pieces in the TRAY (-1), ignoring backend shuffle
        // We keep the correct_position for checking win.
        const initialPieces = (data.pieces || []).map((p: PuzzlePiece) => ({
          ...p,
          current_position: -1, // Start in tray
        }));
        setPieces(initialPieces);
      } catch (err) {
        console.error("Failed to fetch puzzle:", err);
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
        };

        if (error.response?.status === 500) {
          toast.error("Server error occurred. Please try again later.");
        } else if (error.response?.status === 404) {
          toast.error("Puzzle not found.");
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to access this puzzle.");
        } else {
          toast.error("Failed to load puzzle");
        }
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (game_id) fetchPuzzle();
  }, [game_id, isPreview, navigate]);

  // Check for win condition
  const checkWin = useCallback((currentPieces: PuzzlePiece[]): boolean => {
    return currentPieces.every(
      (piece) => piece.current_position === piece.correct_position,
    );
  }, []);

  // Handle game end
  const handleGameEnd = useCallback(
    async (won: boolean) => {
      setIsFinished(true);
      setIsPaused(true);

      if (won) {
        // Celebration confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      try {
        const response = await api.post(
          `/api/game/game-type/puzzle/${game_id}/check`,
          {
            pieces: pieces.map((p) => ({
              id: p.id,
              current_position: p.current_position,
            })),
            moves_count: moves,
            time_taken: time,
          },
        );

        setGameResult(response.data.data || response.data);
      } catch (err) {
        console.error("Failed to submit result:", err);
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 500) {
          toast.error("Server error occurred while saving your score.");
        }
      }
    },
    [game_id, pieces, moves, time],
  );

  // Timer
  useEffect(() => {
    if (!isGameStarted || isPaused || isFinished) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (puzzle?.time_limit && prev >= puzzle.time_limit) {
          handleGameEnd(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameStarted, isPaused, isFinished, puzzle?.time_limit, handleGameEnd]);

  // Restart game
  const restartGame = () => {
    if (puzzle) {
      setPieces(
        puzzle.pieces.map((p) => ({ ...p, current_position: -1 })) || [],
      );
      setMoves(0);
      setTime(0);
      setIsFinished(false);
      setIsPaused(false);
      setGameResult(null);
      setSelectedPiece(null);
      setIsGameStarted(false);
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Add play count
  const addPlayCount = async () => {
    if (!game_id) return;
    try {
      await api.post("/api/game/game-type/puzzle/play-count", {
        game_id: game_id,
      });
    } catch (err) {
      console.error("Failed to update play count:", err);
    }
  };

  // -- DRAG & DROP LOGIC (Assembly Mode) --

  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    if (isPaused || isFinished || !isGameStarted) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", pieceId.toString());
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => setDraggedPiece(pieceId), 10);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Drop on Grid Slot
  const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceIdStr = e.dataTransfer.getData("text/plain");
    if (!sourceIdStr) return;
    const sourceId = parseInt(sourceIdStr, 10);
    if (isNaN(sourceId)) return;

    setPieces((prev) => {
      const newPieces = [...prev];
      const sourcePiece = newPieces.find((p) => p.id === sourceId);
      const targetPiece = newPieces.find(
        (p) => p.current_position === slotIndex,
      );

      if (!sourcePiece) return prev;

      // Move logic
      if (targetPiece) {
        // If slot occupied, swap: target goes to source's old pos (could be tray -1)
        targetPiece.current_position = sourcePiece.current_position;
        sourcePiece.current_position = slotIndex;
      } else {
        // Empty slot, just move
        sourcePiece.current_position = slotIndex;
      }

      // Win check
      if (checkWin(newPieces)) {
        setTimeout(() => handleGameEnd(true), 300);
      }

      return newPieces;
    });

    setDraggedPiece(null);
    setMoves((m) => m + 1);
  };

  // Drop on Tray (Remove from board)
  const handleDropOnTray = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceIdStr = e.dataTransfer.getData("text/plain");
    if (!sourceIdStr) return;
    const sourceId = parseInt(sourceIdStr, 10);

    setPieces((prev) => {
      const newPieces = [...prev];
      const sourcePiece = newPieces.find((p) => p.id === sourceId);
      if (sourcePiece) {
        sourcePiece.current_position = -1; // Back to tray
      }
      return newPieces;
    });

    setDraggedPiece(null);
  };

  // -- CLICK INTERACTION --

  // Handle click on grid slot (Place or Select)
  const handleSlotClick = (slotIndex: number) => {
    if (isPaused || isFinished || !isGameStarted) return;

    if (selectedPiece !== null) {
      // Try to place currently selected piece here (from Tray or another Slot)
      setPieces((prev) => {
        const newPieces = [...prev];
        const sourcePiece = newPieces.find((p) => p.id === selectedPiece);
        const targetPiece = newPieces.find(
          (p) => p.current_position === slotIndex,
        );

        if (sourcePiece) {
          // If moving to same slot, just deselect
          if (sourcePiece.current_position === slotIndex) {
            // Do nothing, just will deselect below
          } else if (targetPiece) {
            // Swap
            targetPiece.current_position = sourcePiece.current_position;
            sourcePiece.current_position = slotIndex;
          } else {
            // Place in empty
            sourcePiece.current_position = slotIndex;
          }
        }

        if (checkWin(newPieces)) setTimeout(() => handleGameEnd(true), 300);
        return newPieces;
      });
      setSelectedPiece(null);
      setMoves((m) => m + 1);
    } else {
      // Nothing selected, check if we clicked a piece on board to select it
      const pieceInSlot = pieces.find((p) => p.current_position === slotIndex);
      if (pieceInSlot) {
        setSelectedPiece(pieceInSlot.id);
      }
    }
  };

  const handleTrayPieceClick = (pieceId: number) => {
    if (isPaused || isFinished || !isGameStarted) return;
    if (selectedPiece === pieceId) setSelectedPiece(null);
    else setSelectedPiece(pieceId);
  };

  // Start game
  const startGame = () => {
    setIsGameStarted(true);
    setIsPaused(false);
    addPlayCount();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-purple-500"></div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4 bg-gradient-to-br from-slate-900 to-slate-800">
        <Typography variant="p" className="text-white">
          Puzzle not found
        </Typography>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  // Calc board dims based on aspect ratio
  const MAX_WIDTH = 500;
  const boardWidth = MAX_WIDTH;
  const boardHeight = boardWidth / imageAspectRatio;

  // Grid calculations
  const gridSize = puzzle.grid_size;
  const pieceWidth = boardWidth / gridSize;
  const pieceHeight = boardHeight / gridSize;

  return (
    <div className="w-full min-h-screen bg-[#0F0F1A] font-sans flex flex-col items-center">
      {/* Header (Back + Title) */}
      <div className="w-full flex items-center px-6 py-4">
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Kembali
        </Button>
        <div className="flex-1 text-center pr-24">
          <Typography
            variant="h1"
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold text-2xl"
          >
            Puzzle Game
          </Typography>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full max-w-6xl px-4 mt-4">
        {/* Top Bar (Stats & Controls) */}
        <div className="w-full bg-[#1A1A2E] rounded-xl p-4 flex items-center justify-between mb-8 shadow-lg border border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
              <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                {puzzle?.difficulty || "LEVEL"} LEVEL
              </span>
            </div>
            <div className="flex items-center gap-2 border-r border-gray-700 pr-6">
              <Timer className="w-5 h-5 text-purple-400" />
              <span className="text-white text-xl font-bold tracking-wider">
                {formatTime(time)}
                {puzzle?.time_limit ? (
                  <span className="text-gray-500 text-base font-normal ml-2">
                    / {formatTime(puzzle.time_limit)}
                  </span>
                ) : null}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-pink-400" />
              <span className="text-white text-xl font-bold tracking-wider">
                {moves}
                {puzzle?.max_moves ? (
                  <span className="text-gray-500 text-base font-normal ml-2">
                    / {puzzle.max_moves} Moves
                  </span>
                ) : (
                  <span className="text-gray-500 text-base font-normal ml-2">
                    Moves
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsPaused(!isPaused)}
              disabled={!isGameStarted || isFinished}
            >
              {isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
              onClick={restartGame}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Game Layout */}
        {!isGameStarted && !isFinished && puzzle ? (
          <div className="text-center py-20">
            <img
              src={`${import.meta.env.VITE_API_URL}/${puzzle.puzzle_image}`}
              className="w-auto h-64 object-contain rounded-xl mx-auto mb-8 shadow-2xl border-4 border-[#1A1A2E]"
            />
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-purple-500/25 transition-all"
              onClick={startGame}
            >
              Mainkan Sekarang
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start w-full justify-center">
            {/* LEFT: Puzzle Board */}
            <div
              className={`relative bg-[#1A1A2E] rounded-xl p-2 shadow-2xl border border-white/5 transition-opacity ${isPaused ? "opacity-50 blur-sm pointer-events-none" : ""}`}
              style={{ width: boardWidth + 16, height: boardHeight + 16 }}
            >
              <div
                className="grid gap-0 bg-[#0F0F1A] rounded overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, ${pieceWidth}px)`,
                  gridTemplateRows: `repeat(${gridSize}, ${pieceHeight}px)`,
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map(
                  (_, slotIndex) => {
                    const piece = pieces.find(
                      (p) => p.current_position === slotIndex,
                    );

                    return (
                      <div
                        key={`slot-${slotIndex}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnSlot(e, slotIndex)}
                        onClick={() => handleSlotClick(slotIndex)}
                        className={`relative border-none bg-[#0F0F1A] ${!piece ? "hover:bg-white/5" : ""} transition-colors`}
                        style={{ width: pieceWidth, height: pieceHeight }}
                      >
                        {!piece && (
                          <div className="absolute inset-0 border border-white/5 box-border pointer-events-none" />
                        )}
                        {piece && (
                          <div
                            draggable={!isPaused}
                            onDragStart={(e) => handleDragStart(e, piece.id)}
                            className={`
                                                        w-full h-full cursor-grab active:cursor-grabbing
                                                        ${selectedPiece === piece.id ? "ring-2 ring-purple-500 z-10" : ""}
                                                        ${draggedPiece === piece.id ? "opacity-30" : ""}
                                                    `}
                            style={{
                              backgroundImage: `url(${import.meta.env.VITE_API_URL}/${puzzle.puzzle_image})`,
                              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                              backgroundPosition: `${((piece.id % gridSize) / (gridSize - 1)) * 100}% ${(Math.floor(piece.id / gridSize) / (gridSize - 1)) * 100}%`,
                              boxShadow:
                                "inset 0 0 0 1px rgba(255,255,255,0.15)", // Subtle border for tile effect
                            }}
                          />
                        )}
                      </div>
                    );
                  },
                )}
              </div>
              {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Typography variant="h3" className="text-white font-bold">
                    PAUSED
                  </Typography>
                </div>
              )}
            </div>

            {/* RIGHT: Tray */}
            <div className="flex-1 w-full max-w-md flex flex-col gap-4">
              <div className="bg-[#1A1A2E] rounded-xl p-6 border border-white/5 text-center min-h-[100px] flex items-center justify-center">
                <Typography className="text-gray-400 text-sm">
                  {pieces.filter((p) => p.current_position === -1).length === 0
                    ? "Semua potongan ada di papan!"
                    : "Tarik potongan dari sini ke papan puzzle."}
                </Typography>
              </div>

              <div
                className="bg-[#1A1A2E] rounded-xl p-4 border border-white/5 min-h-[300px] max-h-[500px] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={handleDropOnTray}
              >
                <div className="flex flex-wrap gap-2 justify-center content-start">
                  {pieces
                    .filter((p) => p.current_position === -1)
                    .map((piece) => (
                      <div
                        key={piece.id}
                        draggable={!isPaused}
                        onDragStart={(e) => handleDragStart(e, piece.id)}
                        onClick={() => handleTrayPieceClick(piece.id)}
                        className={`
                                                cursor-grab active:cursor-grabbing rounded-md overflow-hidden bg-black
                                                ${selectedPiece === piece.id ? "ring-2 ring-purple-500 scale-105" : "hover:scale-105"}
                                                ${draggedPiece === piece.id ? "opacity-30" : ""}
                                                transition-transform
                                            `}
                        style={{
                          width: Math.min(pieceWidth, 100), // constrain tray size
                          height: Math.min(pieceHeight, 100),
                          backgroundImage: `url(${import.meta.env.VITE_API_URL}/${puzzle.puzzle_image})`,
                          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                          backgroundPosition: `${((piece.id % gridSize) / (gridSize - 1)) * 100}% ${(Math.floor(piece.id / gridSize) / (gridSize - 1)) * 100}%`,
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  {pieces.every((p) => p.current_position !== -1) && (
                    <div className="text-gray-600 text-sm py-8 w-full text-center">
                      Tray is empty
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Finished / Result Modal Overlay */}
      {isFinished && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in px-4">
          <div className="bg-[#1A1A2E] rounded-2xl p-8 max-w-sm w-full text-center border border-white/10 shadow-2xl">
            {gameResult?.is_complete ? (
              <>
                <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <Typography
                  variant="h2"
                  className="text-white text-2xl font-bold mb-2"
                >
                  Excellent!
                </Typography>
                <Typography className="text-gray-400 mb-6">
                  Kamu menyelesaikan puzzle ini dalam {formatTime(time)}.
                </Typography>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <RotateCcw className="w-8 h-8 text-red-500" />
                </div>
                <Typography
                  variant="h2"
                  className="text-white text-2xl font-bold mb-2"
                >
                  Game Over
                </Typography>
              </>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={restartGame}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Main Lagi
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                Kembali ke Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
    </div>
  );
}

export default PlayPuzzle;
