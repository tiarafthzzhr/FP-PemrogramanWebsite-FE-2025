import axiosInstance from "@/api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { PuzzleGame, PuzzleSession } from "../types";

interface StartPuzzleResponse {
  sessionId: string;
  gameId: string;
  gameJson: PuzzleGame["game_json"];
}

// GET detail puzzle untuk play (harus published)
const getPuzzleForPlay = async (gameId: string): Promise<PuzzleGame> => {
  const response = await axiosInstance.get(`/game/game-list/puzzle/${gameId}`);
  return response.data.data;
};

// START puzzle + increment play count
const startPuzzle = async (gameId: string): Promise<PuzzleSession> => {
  const response = await axiosInstance.post(`/game/game-list/puzzle/${gameId}/start`);
  return response.data.data; // { sessionId, gameId, gameJson }
};

export const useGetPlayPuzzle = (gameId: string) => {
  const puzzleQuery = useQuery({
    queryKey: ["puzzle-play", gameId],
    queryFn: () => getPuzzleForPlay(gameId),
    enabled: !!gameId,
    staleTime: 1000 * 60 * 2, // 2 menit
  });

  const startMutation = useMutation({
    mutationFn: startPuzzle,
  });

  return {
    puzzle: puzzleQuery.data,
    isLoading: puzzleQuery.isLoading,
    isError: puzzleQuery.isError,
    error: puzzleQuery.error,
    startPuzzle: (id: string) => startMutation.mutate(id),
    session: startMutation.data,
    isStarting: startMutation.isPending,
    startError: startMutation.error,
  };
};