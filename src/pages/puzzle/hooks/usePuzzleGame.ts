import { useState, useEffect, useCallback } from "react";
import type { PuzzleGameJson } from "../types";

interface UsePuzzleGameProps {
  gameJson: PuzzleGameJson;
  sessionId: string;
  gameId: string;
  onFinish: (durationSec: number, moveCount: number) => void;
}

export const usePuzzleGame = ({
  gameJson,
  //sessionId,
  //gameId,
  onFinish,
}: UsePuzzleGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || isPaused || isFinished) return;

    const interval = setInterval(() => {
      setElapsedSec((prev) => {
        const newElapsed = prev + 1;
        // Cek kalau melebihi time limit
        if (gameJson.timeLimitSec && newElapsed > gameJson.timeLimitSec) {
          setIsFinished(true);
          onFinish(newElapsed, moveCount);
          return newElapsed;
        }
        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, isFinished, gameJson.timeLimitSec, moveCount, onFinish]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
    setElapsedSec(0);
    setMoveCount(0);
    setIsFinished(false);
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const incrementMove = useCallback(() => {
    setMoveCount((prev) => prev + 1);
  }, []);

  const finishGame = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    setIsPlaying(false);
    onFinish(elapsedSec, moveCount);
  }, [elapsedSec, moveCount, onFinish]);

  const remainingTime = gameJson.timeLimitSec ? gameJson.timeLimitSec - elapsedSec : null;

  return {
    isPlaying,
    isPaused,
    elapsedSec,
    moveCount,
    isFinished,
    remainingTime,
    startGame,
    pauseGame,
    incrementMove,
    finishGame,
  };
};