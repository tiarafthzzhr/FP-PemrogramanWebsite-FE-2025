import api from "../axios";

export interface UpdateMathGeneratorRequest {
  name?: string;
  description?: string;
  thumbnail_image?: File;

  // Game Settings
  operation?: string;
  difficulty?: "easy" | "medium" | "hard";
  theme?: string;
  game_type?: string;

  // Scoring & Randomization
  question_count?: number;
  score_per_question?: number;
  is_answer_randomized?: boolean;
  is_question_randomized?: boolean;
}

interface UpdateMathGeneratorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    updated: boolean;
  };
}

export const updateMathGenerator = async (
  gameId: string,
  data: UpdateMathGeneratorRequest,
): Promise<UpdateMathGeneratorResponse> => {
  const formData = new FormData();

  console.log("🔧 updateMathGenerator API - Data received:", data);

  // Only append fields that are provided - FLAT structure
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.thumbnail_image)
    formData.append("thumbnail_image", data.thumbnail_image);

  // Game settings as flat fields
  if (data.operation) formData.append("operation", data.operation);
  if (data.difficulty) formData.append("difficulty", data.difficulty);
  if (data.theme) formData.append("theme", data.theme);
  if (data.game_type) {
    console.log("🎯 Adding game_type to FormData:", data.game_type);
    formData.append("game_type", data.game_type);
  } else {
    console.warn("⚠️ game_type is undefined or empty!");
  }
  if (data.question_count)
    formData.append("question_count", String(data.question_count));

  // Scoring & Randomization
  if (data.score_per_question)
    formData.append("score_per_question", String(data.score_per_question));
  if (data.is_answer_randomized !== undefined)
    formData.append("is_answer_randomized", String(data.is_answer_randomized));
  if (data.is_question_randomized !== undefined)
    formData.append(
      "is_question_randomized",
      String(data.is_question_randomized),
    );

  // Log all FormData entries
  console.log("📦 FormData being sent:");
  for (const [key, value] of formData.entries()) {
    console.log(
      `  ${key}:`,
      value instanceof File ? `File(${value.name})` : value,
    );
  }

  const response = await api.patch<UpdateMathGeneratorResponse>(
    `/api/game/game-type/math-generator/${gameId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
