import axios from "../axios";

export const updatePlayCount = async (gameId: string) => {
  const response = await axios.post(`/api/game/play-count`, {
    game_id: gameId,
  });
  return response.data;
};
