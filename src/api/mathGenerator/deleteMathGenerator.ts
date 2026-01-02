import api from "../axios";

interface DeleteMathGeneratorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    deleted: boolean;
  };
}

export const deleteMathGenerator = async (
  gameId: string,
): Promise<DeleteMathGeneratorResponse> => {
  const response = await api.delete<DeleteMathGeneratorResponse>(
    `/api/game/game-type/math-generator/${gameId}`,
  );

  return response.data;
};
