import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Settings, Leaf, Zap, Flame, X } from "lucide-react";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";

interface PuzzleGame {
  id: string;
  name: string;
  description: string;
  thumbnail_image: string;
  difficulty: string;
  grid_size: number;
  is_published: boolean;
  creator_id: string;
}

function PuzzleHome() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!(token && user);

  const [puzzlesByDifficulty, setPuzzlesByDifficulty] = useState<{
    easy: PuzzleGame[];
    medium: PuzzleGame[];
    hard: PuzzleGame[];
  }>({
    easy: [],
    medium: [],
    hard: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        setLoading(true);
        // 1. Fetch list of puzzle games from generic endpoint
        const response = await api.get("/api/game?gameTypeSlug=puzzle");
        const basicPuzzles = response.data.data || [];

        // 2. Fetch details for each puzzle to get 'difficulty'
        // We use the public play endpoint because it contains the game config (difficulty, grid_size, etc.)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detailedPuzzlesPromises = basicPuzzles.map(async (game: any) => {
          try {
            const detailRes = await api.get(
              `/api/game/game-type/puzzle/${game.id}/play/public`,
            );
            const detail = detailRes.data.data;
            return {
              ...game,
              difficulty: detail.difficulty || "medium", // visual fallback
              grid_size: detail.grid_size,
              is_published: detail.is_published,
              creator_id: game.creator_id || detail.creator_id, // Ensure we get creator_id
            } as PuzzleGame;
          } catch (err) {
            console.error(`Failed to fetch detail for game ${game.id}`, err);
            return null;
          }
        });

        const detailedPuzzles = (
          await Promise.all(detailedPuzzlesPromises)
        ).filter((p) => p !== null) as PuzzleGame[];

        // 3. Group by difficulty
        const grouped = {
          easy: detailedPuzzles.filter((p) => p.difficulty === "easy"),
          medium: detailedPuzzles.filter((p) => p.difficulty === "medium"),
          hard: detailedPuzzles.filter((p) => p.difficulty === "hard"),
        };
        setPuzzlesByDifficulty(grouped);
      } catch (err) {
        console.error("Failed to fetch puzzles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, []);

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  const handlePlayPuzzle = (gameId: string) => {
    navigate(`/games/puzzle/play/${gameId}`);
  };

  const handleDeleteGame = async (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to delete this puzzle? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/api/game/game-type/puzzle/${gameId}`);

      // Remove locally
      setPuzzlesByDifficulty((prev) => {
        const newDocs = { ...prev };
        if (selectedDifficulty) {
          const key = selectedDifficulty as keyof typeof prev;
          newDocs[key] = newDocs[key].filter((p) => p.id !== gameId);
        }
        return newDocs;
      });
    } catch (error) {
      console.error("Failed to delete puzzle:", error);
      alert("Failed to delete puzzle.");
    }
  };

  const difficultyCards = [
    {
      id: "easy",
      name: "Easy",
      icon: Leaf,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      barColor: "bg-green-500",
      description: "Untuk pemula. Grid 3x3 dengan waktu santai.",
      count: puzzlesByDifficulty.easy.length,
    },
    {
      id: "medium",
      name: "Medium",
      icon: Zap,
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      barColor: "bg-yellow-500",
      description: "Tantangan seru. Grid 4x4 butuh ketelitian.",
      count: puzzlesByDifficulty.medium.length,
    },
    {
      id: "hard",
      name: "Hard",
      icon: Flame,
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      barColor: "bg-red-500",
      description: "Mode ahli. Grid 5x5 untuk master puzzle.",
      count: puzzlesByDifficulty.hard.length,
    },
  ];

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-6 md:px-12 py-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => {
            if (selectedDifficulty) setSelectedDifficulty(null);
            else navigate("/");
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />{" "}
          {selectedDifficulty ? "Ganti Level" : "Kembali"}
        </Button>

        {isAuthenticated && (
          <Button
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={() => navigate("/games/puzzle/create")}
          >
            <Settings className="mr-2 h-4 w-4" /> Kelola Puzzle
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12 md:py-10">
        {/* Badge */}
        <div className="bg-purple-500/30 text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          Game Zone
        </div>

        {/* Title */}
        <Typography
          variant="h1"
          className="text-white text-4xl md:text-5xl font-bold text-center mb-2"
        >
          {selectedDifficulty ? `Puzzle Level` : "Pilih Tingkat"}
        </Typography>
        <Typography
          variant="h1"
          className="text-purple-400 text-4xl md:text-5xl font-bold text-center mb-6 capitalize"
        >
          {selectedDifficulty ? selectedDifficulty : "Kesulitanmu"}
        </Typography>

        {!selectedDifficulty ? (
          <>
            {/* Subtitle */}
            <Typography
              variant="p"
              className="text-gray-400 text-center max-w-lg mb-12"
            >
              Tantang dirimu dengan berbagai level kesulitan puzzle yang
              tersedia.
            </Typography>

            {/* Difficulty Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              {difficultyCards.map((card) => {
                const Icon = card.icon;
                const hasGames = card.count > 0;

                return (
                  <div
                    key={card.id}
                    onClick={() => hasGames && handleDifficultyClick(card.id)}
                    className={`
                                          relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 
                                          border-2 transition-all duration-300 cursor-pointer
                                          border-slate-700/50 hover:border-purple-500 hover:bg-slate-800/70 hover:scale-105
                                          ${!hasGames ? "opacity-50 cursor-not-allowed" : ""}
                                        `}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>

                    {/* Name */}
                    <Typography
                      variant="h3"
                      className={`text-xl font-bold mb-2 ${card.iconColor}`}
                    >
                      {card.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="p"
                      className="text-gray-400 text-sm mb-4"
                    >
                      {card.description}
                    </Typography>

                    {/* Game Count */}
                    <Typography variant="small" className="text-gray-500">
                      {card.count} puzzle tersedia
                    </Typography>

                    {/* Colored Bar */}
                    <div
                      className={`absolute bottom-0 left-6 right-6 h-1 ${card.barColor} rounded-full`}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="w-full max-w-6xl animate-fade-in">
            {/* Selected Puzzle List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {puzzlesByDifficulty[
                selectedDifficulty as keyof typeof puzzlesByDifficulty
              ].map((puzzle) => (
                <div
                  key={puzzle.id}
                  onClick={() => handlePlayPuzzle(puzzle.id)}
                  className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 relative"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${puzzle.thumbnail_image}`}
                      alt={puzzle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button className="bg-purple-600 rounded-full">
                        Main Sekarang
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <Typography
                      variant="h4"
                      className="text-white font-bold truncate mb-1"
                    >
                      {puzzle.name}
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-gray-400 text-xs line-clamp-2"
                    >
                      {puzzle.description || "Tantang dirimu!"}
                    </Typography>
                  </div>

                  {/* Delete Button for Admin/Creator */}
                  {(user?.role === "super_admin" ||
                    user?.id === puzzle.creator_id) && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => handleDeleteGame(e, puzzle.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {puzzlesByDifficulty[
              selectedDifficulty as keyof typeof puzzlesByDifficulty
            ].length === 0 && (
              <div className="text-center py-20">
                <Typography className="text-gray-500">
                  Tidak ada puzzle di level ini.
                </Typography>
                <Button
                  variant="link"
                  onClick={() => setSelectedDifficulty(null)}
                  className="text-purple-400"
                >
                  Kembali
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default PuzzleHome;
