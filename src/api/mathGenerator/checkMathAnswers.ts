import api from "../axios";

export interface MathAnswerSubmission {
  question_index: number;
  selected_answer: string;
}

export interface MathAnswerResult {
  question_index: number;
  is_correct: boolean;
  correct_answer: number | string;
}

export interface CheckMathAnswersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    score: number; // Percentage (0-100)
    correct_count: number;
    max_score: number; // Total possible score
    results: MathAnswerResult[];
  };
}

/**
 * Check Math Generator answers
 */
export const checkMathAnswers = async (
  gameId: string,
  answers: MathAnswerSubmission[],
): Promise<CheckMathAnswersResponse> => {
  const response = await api.post<CheckMathAnswersResponse>(
    `/api/game/game-type/math-generator/${gameId}/check`,
    { answers },
  );

  return response.data;
};
