import api from "../axios";

interface PublishGameResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    is_published: boolean;
  };
}

export const updatePublishStatus = async (
  gameId: string,
  isPublish: boolean,
): Promise<PublishGameResponse> => {
  const response = await api.patch<PublishGameResponse>("/api/game/", {
    game_id: gameId,
    is_publish: isPublish,
  });

  return response.data;
};
