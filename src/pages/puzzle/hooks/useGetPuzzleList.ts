import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";
import type { PuzzleGame } from "../types";

export const getPuzzleList = async (): Promise<PuzzleGame[]> => {
  const response = await axiosInstance.get("/game/game-list/puzzle");
  return response.data.data; 
};

export const useGetPuzzleList = () => {
  return useQuery({
    queryKey: ["puzzle-list"],
    queryFn: getPuzzleList,
    staleTime: 1000 * 60 * 5, // 5 menit
    gcTime: 1000 * 60 * 10, // 10 menit
    refetchOnWindowFocus: false,
    select: (data) => 
      data
        .filter((game: PuzzleGame) => game.is_published)
        .sort((a: PuzzleGame, b: PuzzleGame) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
  });
};