import api from "../axios";

export interface CreateMathGeneratorRequest {
  name: string;
  description?: string;
  thumbnail_image?: File;
  is_publish_immediately: boolean;

  // Game Settings
  operation: string; // Will be converted from selectedOperations array
  difficulty: "easy" | "medium" | "hard";
  theme: string;
  game_type?: string;

  // Scoring & Randomization
  question_count: number;
  score_per_question: number;
  is_answer_randomized?: boolean;
  is_question_randomized?: boolean;

  // Additional fields for our frontend
  grade_level?: string;
  min_number?: number;
  max_number?: number;
  custom_background?: File;
}

interface CreateMathGeneratorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
  };
}

export const createMathGenerator = async (
  data: CreateMathGeneratorRequest,
): Promise<CreateMathGeneratorResponse> => {
  const formData = new FormData();

  // Basic Info
  formData.append("name", data.name);
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.thumbnail_image) {
    formData.append("thumbnail_image", data.thumbnail_image);
  }
  formData.append(
    "is_publish_immediately",
    String(data.is_publish_immediately),
  );

  // Game Settings (as nested object structure)
  // Game settings as flat fields
  formData.append("operation", data.operation);
  formData.append("difficulty", data.difficulty);
  formData.append("theme", data.theme);
  formData.append("game_type", data.game_type || "quiz");
  formData.append("question_count", String(data.question_count));

  // Scoring & Randomization
  formData.append("score_per_question", String(data.score_per_question));
  if (data.is_answer_randomized !== undefined) {
    formData.append("is_answer_randomized", String(data.is_answer_randomized));
  }
  if (data.is_question_randomized !== undefined) {
    formData.append(
      "is_question_randomized",
      String(data.is_question_randomized),
    );
  }

  const response = await api.post<CreateMathGeneratorResponse>(
    "/api/game/game-type/math-generator/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
