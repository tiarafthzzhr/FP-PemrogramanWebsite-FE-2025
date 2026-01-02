import api from "../axios";

export interface MathGeneratorDetail {
  id: string;
  name: string;
  description?: string;
  thumbnail_image?: string;
  is_published: boolean;
  creator_id: string;
  settings: {
    operation: string;
    difficulty: "easy" | "medium" | "hard";
    theme: string;
    question_count: number;
  };
  score_per_question: number;
  total_played: number;
  liked_by_count: number;
  created_at: string;
  updated_at: string;
}

interface GetMathGeneratorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MathGeneratorDetail;
}

export const getMathGenerator = async (
  gameId: string,
): Promise<MathGeneratorDetail> => {
  const response = await api.get<GetMathGeneratorResponse>(
    `/api/game/game-type/math-generator/${gameId}`,
  );

  return response.data.data;
};
