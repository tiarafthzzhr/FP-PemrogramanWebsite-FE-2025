import api from "../axios";

export interface MathQuestion {
  index: number;
  question: string;
  options: (number | string)[];
}

export interface MathGeneratorPlayData {
  id: string;
  name: string;
  description: string;
  thumbnail_image: string;
  settings: {
    operation: string;
    difficulty: string;
    theme: string;
    question_count: number;
  };
  score_per_question: number;
  questions: MathQuestion[];
}

interface PlayMathGeneratorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MathGeneratorPlayData;
}

/**
 * Get Math Generator game for playing (Public - only published games)
 */
export const playMathGeneratorPublic = async (
  gameId: string,
): Promise<PlayMathGeneratorResponse> => {
  const response = await api.get<PlayMathGeneratorResponse>(
    `/api/game/game-type/math-generator/${gameId}/play/public`,
  );

  return response.data;
};

/**
 * Get Math Generator game for playing (Private - for creator and admin)
 */
export const playMathGeneratorPrivate = async (
  gameId: string,
): Promise<PlayMathGeneratorResponse> => {
  const response = await api.get<PlayMathGeneratorResponse>(
    `/api/game/game-type/math-generator/${gameId}/play/private`,
  );

  return response.data;
};
