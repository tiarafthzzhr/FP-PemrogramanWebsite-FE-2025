import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { TextareaField } from "@/components/ui/textarea-field";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import Dropzone from "@/components/ui/dropzone";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, SaveIcon, X, Trash2 } from "lucide-react";
import api from "@/api/axios";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PuzzleData {
  id: string;
  name: string;
  description: string;
  thumbnail_image: string;
  is_published: boolean;
  game_json: {
    puzzle_image: string;
    difficulty: string;
    grid_size: number;
    time_limit?: number;
    max_moves?: number;
  };
}

function EditPuzzle() {
  const { game_id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [puzzleImage, setPuzzleImage] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [gridSize, setGridSize] = useState("3");
  const [timeLimit, setTimeLimit] = useState("");
  const [maxMoves, setMaxMoves] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        setFetchLoading(true);
        const response = await api.get(`/api/game/game-type/puzzle/${game_id}`);
        const data = response.data.data;
        setPuzzle(data);
        setTitle(data.name);
        setDescription(data.description || "");
        setDifficulty(data.game_json.difficulty || "medium");
        setGridSize(data.game_json.grid_size?.toString() || "3");
        setTimeLimit(data.game_json.time_limit?.toString() || "");
        setMaxMoves(data.game_json.max_moves?.toString() || "");
        setIsPublished(data.is_published);
      } catch (err) {
        console.error("Failed to fetch puzzle:", err);
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
        };

        if (error.response?.status === 500) {
          toast.error("Server error occurred. Please try again later.");
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to edit this puzzle.");
          navigate("/my-projects");
        } else if (error.response?.status === 404) {
          toast.error("Puzzle not found.");
          navigate("/my-projects");
        } else {
          toast.error("Failed to load puzzle");
          navigate("/my-projects");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    if (game_id) fetchPuzzle();
  }, [game_id, navigate]);

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (title.length > 128) {
      toast.error("Title must be at most 128 characters");
      return;
    }

    if (description.length > 256) {
      toast.error("Description must be at most 256 characters");
      return;
    }

    const gridSizeNum = parseInt(gridSize);
    if (gridSizeNum < 2 || gridSizeNum > 6) {
      toast.error("Grid size must be between 2 and 6");
      return;
    }

    if (timeLimit) {
      const timeLimitNum = parseInt(timeLimit);
      if (timeLimitNum < 30 || timeLimitNum > 3600) {
        toast.error("Time limit must be between 30 and 3600 seconds");
        return;
      }
    }

    if (maxMoves) {
      const maxMovesNum = parseInt(maxMoves);
      if (maxMovesNum < 10 || maxMovesNum > 1000) {
        toast.error("Max moves must be between 10 and 1000");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", title);
      if (description) formData.append("description", description);
      if (thumbnail) formData.append("thumbnail_image", thumbnail);
      if (puzzleImage) formData.append("puzzle_image", puzzleImage);
      formData.append("difficulty", difficulty);
      formData.append("grid_size", gridSize);
      if (timeLimit) formData.append("time_limit", timeLimit);
      if (maxMoves) formData.append("max_moves", maxMoves);
      formData.append("is_publish", isPublished.toString());

      await api.patch(`/api/game/game-type/puzzle/${game_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Puzzle updated successfully!");
      navigate("/my-projects");
    } catch (err: unknown) {
      console.error("Failed to update puzzle:", err);
      const error = err as {
        response?: { data?: { message?: string }; status?: number };
      };

      if (error.response?.status === 500) {
        toast.error("Server error occurred. Please try again later.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to edit this puzzle.");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to update puzzle";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/api/game/game-type/puzzle/${game_id}`);
      toast.success("Puzzle deleted successfully!");
      navigate("/my-projects");
    } catch (err: unknown) {
      console.error("Failed to delete puzzle:", err);
      const error = err as {
        response?: { data?: { message?: string }; status?: number };
      };

      if (error.response?.status === 500) {
        toast.error("Server error occurred. Please try again later.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this puzzle.");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to delete puzzle";
        toast.error(errorMessage);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "";
    }
  };

  if (fetchLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <Typography variant="p">Puzzle not found</Typography>
        <Button onClick={() => navigate("/my-projects")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col">
      <div className="bg-white h-fit w-full flex justify-between items-center px-8 py-4">
        <Button
          size="sm"
          variant="ghost"
          className="hidden md:flex"
          onClick={() => navigate("/my-projects")}
        >
          <ArrowLeft /> Back
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block md:hidden"
          onClick={() => navigate("/my-projects")}
        >
          <ArrowLeft />
        </Button>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" disabled={deleteLoading}>
              <Trash2 className="w-4 h-4" />{" "}
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Puzzle?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this puzzle? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="w-full h-full p-8 justify-center items-center flex flex-col">
        <div className="max-w-3xl w-full space-y-6">
          <div>
            <Typography variant="h3">Edit Puzzle Game</Typography>
            <Typography variant="p" className="mt-2">
              Update your puzzle settings and images
            </Typography>
          </div>

          {/* Basic Info Card */}
          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <div>
              <FormField
                required
                label="Game Title"
                placeholder="My Awesome Puzzle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <TextareaField
              label="Description"
              placeholder="Describe your puzzle game"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div>
              <Dropzone
                label="Thumbnail Image (Leave empty to keep current)"
                allowedTypes={["image/png", "image/jpeg"]}
                maxSize={2 * 1024 * 1024}
                onChange={(file) => setThumbnail(file)}
              />
              {!thumbnail && puzzle.thumbnail_image && (
                <div className="mt-2">
                  <Typography variant="small" className="text-gray-500">
                    Current thumbnail:
                  </Typography>
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${puzzle.thumbnail_image}`}
                    alt="Current thumbnail"
                    className="mt-2 max-w-xs rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div>
              <Dropzone
                label="Puzzle Image (Leave empty to keep current)"
                allowedTypes={["image/png", "image/jpeg"]}
                maxSize={5 * 1024 * 1024}
                onChange={(file) => setPuzzleImage(file)}
              />
              {!puzzleImage && puzzle.game_json.puzzle_image && (
                <div className="mt-2">
                  <Typography variant="small" className="text-gray-500">
                    Current puzzle image:
                  </Typography>
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${puzzle.game_json.puzzle_image}`}
                    alt="Current puzzle"
                    className="mt-2 max-w-xs rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Puzzle Settings Card */}
          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <Typography variant="p" className="font-semibold">
              Puzzle Settings
            </Typography>

            <div className="grid w-full items-center gap-1.5">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <span className="text-green-500 font-medium">Easy</span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="text-yellow-500 font-medium">Medium</span>
                  </SelectItem>
                  <SelectItem value="hard">
                    <span className="text-red-500 font-medium">Hard</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Typography
                variant="small"
                className={`${getDifficultyColor(difficulty)}`}
              >
                {difficulty === "easy" && "Great for beginners"}
                {difficulty === "medium" && "Balanced challenge"}
                {difficulty === "hard" && "For puzzle masters"}
              </Typography>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label>Grid Size</Label>
              <Select value={gridSize} onValueChange={setGridSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grid size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2x2 (4 pieces)</SelectItem>
                  <SelectItem value="3">3x3 (9 pieces)</SelectItem>
                  <SelectItem value="4">4x4 (16 pieces)</SelectItem>
                  <SelectItem value="5">5x5 (25 pieces)</SelectItem>
                  <SelectItem value="6">6x6 (36 pieces)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <FormField
                label="Time Limit (seconds)"
                placeholder="300"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
              <Typography variant="small" className="text-gray-500 mt-1">
                Optional. Min: 30, Max: 3600 seconds
              </Typography>
            </div>

            <div>
              <FormField
                label="Max Moves"
                placeholder="100"
                type="number"
                value={maxMoves}
                onChange={(e) => setMaxMoves(e.target.value)}
              />
              <Typography variant="small" className="text-gray-500 mt-1">
                Optional. Min: 10, Max: 1000 moves
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Label>Published</Label>
                <Typography variant="small">
                  Make this puzzle visible to everyone
                </Typography>
              </div>
              <div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <X /> Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel? All unsaved changes will be
                    lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/my-projects")}>
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              variant="outline"
              className="bg-black text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              <SaveIcon /> {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPuzzle;
