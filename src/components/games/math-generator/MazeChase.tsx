import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";

interface MazeChaseProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  userName?: string;
}

interface Position {
  x: number;
  y: number;
}

export function MazeChase({ questions, onComplete, onExit }: MazeChaseProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState<Position>({ x: 5, y: 5 });
  const [walls, setWalls] = useState<Position[]>([]);
  const [decoyPositions, setDecoyPositions] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];
  const gridSize = 6;

  // BFS pathfinding to check if path exists
  const hasPath = (
    start: Position,
    end: Position,
    obstacles: Position[],
  ): boolean => {
    const queue: Position[] = [start];
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.x === end.x && current.y === end.y) {
        return true;
      }

      const directions = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];

      for (const next of directions) {
        const key = `${next.x},${next.y}`;

        if (
          next.x >= 0 &&
          next.x < gridSize &&
          next.y >= 0 &&
          next.y < gridSize &&
          !visited.has(key) &&
          !obstacles.some((o) => o.x === next.x && o.y === next.y)
        ) {
          visited.add(key);
          queue.push(next);
        }
      }
    }

    return false;
  };

  // Generate maze with walls ensuring there's always a path
  const generateMaze = () => {
    let newWalls: Position[] = [];
    let attempts = 0;
    const maxAttempts = 50;

    do {
      newWalls = [];

      // Create strategic walls but fewer
      const possibleWalls = [
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 4 },
        { x: 4, y: 1 },
        { x: 4, y: 3 },
        { x: 4, y: 4 },
        { x: 1, y: 3 },
        { x: 3, y: 2 },
        { x: 5, y: 2 },
        { x: 3, y: 4 },
      ];

      // Add random walls with 50% probability
      possibleWalls.forEach((wall) => {
        if (Math.random() > 0.5) {
          newWalls.push(wall);
        }
      });

      attempts++;
    } while (
      !hasPath({ x: 0, y: 0 }, { x: 5, y: 5 }, newWalls) &&
      attempts < maxAttempts
    );

    // If still no path, use minimal walls
    if (!hasPath({ x: 0, y: 0 }, { x: 5, y: 5 }, newWalls)) {
      newWalls = [
        { x: 2, y: 2 },
        { x: 4, y: 3 },
        { x: 1, y: 4 },
      ];
    }

    return newWalls;
  };

  useEffect(() => {
    // Reset player position
    setPlayerPos({ x: 0, y: 0 });

    // Generate new maze
    const newWalls = generateMaze();
    setWalls(newWalls);

    // Place target (correct answer) - always accessible from start
    let target: Position = { x: 5, y: 5 };

    // Verify path exists from start to target
    if (!hasPath({ x: 0, y: 0 }, target, newWalls)) {
      // Try alternative target positions
      const alternativeTargets = [
        { x: 5, y: 4 },
        { x: 4, y: 5 },
        { x: 5, y: 3 },
        { x: 3, y: 5 },
      ];

      for (const altTarget of alternativeTargets) {
        if (
          hasPath({ x: 0, y: 0 }, altTarget, newWalls) &&
          !newWalls.some((w) => w.x === altTarget.x && w.y === altTarget.y)
        ) {
          target = altTarget;
          break;
        }
      }
    }

    setTargetPos(target);

    // Place decoys (wrong answers) - avoid blocking the main path
    const decoys: Position[] = [];
    const wrongAnswers =
      question.options?.filter((opt) => opt !== question.answer) || [];

    wrongAnswers.forEach(() => {
      let decoy: Position;
      let attempts = 0;

      do {
        decoy = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };
        attempts++;
      } while (
        attempts < 20 &&
        (newWalls.some((w) => w.x === decoy.x && w.y === decoy.y) ||
          decoys.some((d) => d.x === decoy.x && d.y === decoy.y) ||
          (decoy.x === target.x && decoy.y === target.y) ||
          (decoy.x === 0 && decoy.y === 0))
      );

      // Only add if valid position found
      if (attempts < 20) {
        decoys.push(decoy);
      }
    });
    setDecoyPositions(decoys);
  }, [currentQuestion, question]);

  const movePlayer = (dx: number, dy: number) => {
    const newPos = {
      x: playerPos.x + dx,
      y: playerPos.y + dy,
    };

    // Check bounds
    if (
      newPos.x < 0 ||
      newPos.x >= gridSize ||
      newPos.y < 0 ||
      newPos.y >= gridSize
    ) {
      return;
    }

    // Check walls
    if (walls.some((w) => w.x === newPos.x && w.y === newPos.y)) {
      return;
    }

    setPlayerPos(newPos);

    // Check if reached target (correct answer)
    if (newPos.x === targetPos.x && newPos.y === targetPos.y) {
      setScore(score + 1);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResult(true);
        }
      }, 500);
    }

    // Check if hit decoy (wrong answer)
    const hitDecoy = decoyPositions.find(
      (d) => d.x === newPos.x && d.y === newPos.y,
    );
    if (hitDecoy) {
      // Wrong answer - just move to next question
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResult(true);
        }
      }, 500);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPos, walls, targetPos, decoyPositions]);

  if (showResult) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Maze Complete! 🎯</h2>
          <div className="text-6xl font-bold mb-4">
            {score}/{questions.length}
          </div>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Generator
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex flex-col relative">
      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      {/* Header */}
      <div className="text-center pt-3 pb-2">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-2 max-w-md mx-auto mb-2 shadow-xl">
          <h3 className="text-emerald-900 font-bold text-xs mb-1">
            🧭 Navigate to correct answer!
          </h3>
          <div className="text-3xl font-black">{question?.display}</div>
        </div>
        <div className="flex justify-center gap-3 text-white font-bold text-sm">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl">
            Q {currentQuestion + 1}/{questions.length}
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl">
            ⭐ {score}
          </div>
        </div>
      </div>

      {/* Maze Grid */}
      <div className="flex-1 flex items-center justify-center px-3 pb-3">
        <div className="bg-white/95 backdrop-blur rounded-3xl p-3 shadow-2xl max-w-lg w-full">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const x = i % gridSize;
              const y = Math.floor(i / gridSize);
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const isTarget = targetPos.x === x && targetPos.y === y;
              const isWall = walls.some((w) => w.x === x && w.y === y);
              const decoyIndex = decoyPositions.findIndex(
                (d) => d.x === x && d.y === y,
              );
              const isDecoy = decoyIndex !== -1;
              const decoyValue = isDecoy
                ? question.options?.filter((opt) => opt !== question.answer)[
                    decoyIndex
                  ]
                : null;

              return (
                <motion.div
                  key={i}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-base font-bold ${
                    isWall
                      ? "bg-gradient-to-br from-gray-700 to-gray-900 border-gray-600 shadow-inner"
                      : isPlayer
                        ? "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-lg"
                        : isTarget
                          ? "bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600 shadow-lg animate-pulse"
                          : isDecoy
                            ? "bg-gradient-to-br from-red-300 to-red-400 border-red-500"
                            : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  }`}
                  whileHover={!isWall && !isPlayer ? { scale: 1.05 } : {}}
                >
                  {isWall && "🧱"}
                  {isPlayer && "🏃"}
                  {isTarget && (
                    <span className="text-lg">{question.answer}</span>
                  )}
                  {isDecoy && <span className="text-sm">{decoyValue}</span>}
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center mt-3">
            <div className="grid grid-cols-3 gap-1.5">
              <div />
              <motion.button
                onClick={() => movePlayer(0, -1)}
                className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
              <div />

              <motion.button
                onClick={() => movePlayer(-1, 0)}
                className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => movePlayer(0, 1)}
                className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowDown className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => movePlayer(1, 0)}
                className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
