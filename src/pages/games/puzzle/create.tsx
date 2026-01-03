import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { TextareaField } from "@/components/ui/textarea-field";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import Dropzone from "@/components/ui/dropzone";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, SaveIcon, X, EyeIcon } from "lucide-react";
import api from "@/api/axios";
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

function CreatePuzzle() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [puzzleImage, setPuzzleImage] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [gridSize, setGridSize] = useState("3");
  const [timeLimit, setTimeLimit] = useState("");
  const [maxMoves, setMaxMoves] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (publish = false) => {
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

    if (!thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }

    if (!puzzleImage) {
      toast.error("Puzzle image is required");
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
      formData.append("thumbnail_image", thumbnail);
      formData.append("puzzle_image", puzzleImage);
      formData.append("difficulty", difficulty);
      formData.append("grid_size", gridSize);
      if (timeLimit) formData.append("time_limit", timeLimit);
      if (maxMoves) formData.append("max_moves", maxMoves);
      formData.append("is_publish_immediately", publish.toString());

      await api.post("/api/game/game-type/puzzle", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Puzzle created successfully!");
      navigate("/create-projects");
    } catch (err: unknown) {
      console.error("Failed to create puzzle:", err);
      const error = err as {
        response?: { data?: { message?: string }; status?: number };
      };

      if (error.response?.status === 500) {
        toast.error("Server error occurred. Please try again later.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to create puzzles.");
      } else if (error.response?.status === 401) {
        toast.error("Please login to create puzzles.");
        navigate("/login");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to create puzzle";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col">
      <div className="bg-white h-fit w-full flex justify-between items-center px-8 py-4">
        <Button
          size="sm"
          variant="ghost"
          className="hidden md:flex"
          onClick={() => navigate("/create-projects")}
        >
          <ArrowLeft /> Back
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block md:hidden"
          onClick={() => navigate("/create-projects")}
        >
          <ArrowLeft />
        </Button>
      </div>
      <div className="w-full h-full p-8 justify-center items-center flex flex-col">
        <div className="max-w-3xl w-full space-y-6">
          <div>
            <Typography variant="h3">Create Puzzle Game</Typography>
            <Typography variant="p" className="mt-2">
              Upload an image and configure the puzzle settings. Players will
              need to arrange the shuffled pieces to complete the image.
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
              <Typography variant="small" className="text-gray-500 mt-1">
                Max 128 characters
              </Typography>
            </div>

            <TextareaField
              label="Description"
              placeholder="Describe your puzzle game"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Typography variant="small" className="text-gray-500 -mt-4">
              Max 256 characters
            </Typography>

            <div>
              <Dropzone
                required
                label="Thumbnail Image"
                allowedTypes={["image/png", "image/jpeg"]}
                maxSize={2 * 1024 * 1024}
                onChange={(file) => setThumbnail(file)}
              />
            </div>

            <div>
              <Dropzone
                required
                label="Puzzle Image"
                allowedTypes={["image/png", "image/jpeg"]}
                maxSize={5 * 1024 * 1024}
                onChange={(file) => setPuzzleImage(file)}
              />
              <Typography variant="small" className="text-gray-500 mt-2">
                This image will be split into pieces for the puzzle
              </Typography>
            </div>
          </div>

          {/* Puzzle Settings Card */}
          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <Typography variant="p" className="font-semibold">
              Puzzle Settings
            </Typography>

            <div className="grid w-full items-center gap-1.5">
              <Label>
                Difficulty <span className="text-red-500">*</span>
              </Label>
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
              <Label>
                Grid Size <span className="text-red-500">*</span>
              </Label>
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
              <Typography variant="small" className="text-gray-500">
                Larger grids are more challenging
              </Typography>
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
          </div>

          {/* Preview Section */}
          {puzzleImage && (
            <div className="bg-white w-full h-full p-6 space-y-4 rounded-xl border">
              <Typography variant="p" className="font-semibold">
                Preview
              </Typography>
              <div className="flex justify-center">
                <img
                  src={URL.createObjectURL(puzzleImage)}
                  alt="Puzzle Preview"
                  className="max-w-md rounded-lg shadow-lg border"
                />
              </div>
              <Typography variant="small" className="text-center text-gray-500">
                This image will be divided into {gridSize}x{gridSize} ={" "}
                {parseInt(gridSize) ** 2} pieces
              </Typography>
            </div>
          )}

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
                  <AlertDialogAction
                    onClick={() => navigate("/create-projects")}
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              <SaveIcon /> {loading ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-black text-white"
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              <EyeIcon /> {loading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePuzzle;
