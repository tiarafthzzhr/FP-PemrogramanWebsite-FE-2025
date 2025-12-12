// src/pages/puzzle/hooks/useFinishPuzzle.ts
import axiosInstance from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FinishPuzzlePayload {
  sessionId: string;
  gameId: string;
  moveCount?: number;
}

interface FinishPuzzleResponse {
  message: string;
  sessionId: string;
  startedAt: string;
  finishedAt: string;
  totalDuration: number;
  moveCount: number;
  game: {
    id: string;
    title: string;
    thumbnail: string | null;
  };
}

const finishPuzzle = async (payload: FinishPuzzlePayload): Promise<FinishPuzzleResponse> => {
  const response = await axiosInstance.post("/game/game-list/puzzle/finish", payload);
  return response.data.data;
};

export const useFinishPuzzle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishPuzzle,
    onSuccess: () => {
      // Optional: invalidate list kalau mau refresh total_played
      queryClient.invalidateQueries({ queryKey: ["puzzle-list"] });
    },
  });
};