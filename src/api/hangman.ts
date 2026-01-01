import api from "./axios";

interface HangmanQuestion {
  question: string;
  answer: string;
}

interface CreateTemplateData {
  name: string;
  description?: string;
  is_question_shuffled: boolean;
  score_per_question: number;
  questions: HangmanQuestion[];
  thumbnail?: File;
  is_publish_immediately?: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  profilePicture?: string;
  score: number;
  timeTaken?: number | null;
  createdAt: string;
}

export const createHangmanTemplate = async (data: CreateTemplateData) => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  formData.append("is_question_shuffled", String(data.is_question_shuffled));
  formData.append("score_per_question", String(data.score_per_question));
  formData.append("questions", JSON.stringify(data.questions));
  formData.append(
    "is_publish_immediately",
    String(data.is_publish_immediately ?? false),
  );

  if (data.thumbnail) {
    formData.append("thumbnail_image", data.thumbnail);
  }

  const response = await api.post(`/api/game/game-type/hangman`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getHangmanTemplate = async (gameId: string) => {
  const response = await api.get(`/api/game/game-type/hangman/${gameId}`);
  return response.data;
};

export const getAllHangmanTemplates = async (userId?: string) => {
  const response = await api.get(`/api/game/game-type/hangman`, {
    params: {
      ...(userId && { userId }),
    },
  });
  return response.data;
};

export const getUserHangmanTemplates = async () => {
  const response = await api.get(`/api/game/game-type/hangman`, {
    params: {
      userId: localStorage.getItem("userId"),
    },
  });
  return response.data;
};

export const updateHangmanTemplate = async (
  gameId: string,
  data: Partial<CreateTemplateData>,
) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.is_question_shuffled !== undefined)
    formData.append("is_question_shuffled", String(data.is_question_shuffled));
  if (data.score_per_question !== undefined)
    formData.append("score_per_question", String(data.score_per_question));
  if (data.questions)
    formData.append("questions", JSON.stringify(data.questions));
  if (data.is_publish_immediately !== undefined)
    formData.append("is_publish", String(data.is_publish_immediately));
  if (data.thumbnail) formData.append("thumbnail_image", data.thumbnail);

  const response = await api.patch(
    `/api/game/game-type/hangman/${gameId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
};

export const deleteHangmanTemplate = async (gameId: string) => {
  const response = await api.delete(`/api/game/game-type/hangman/${gameId}`);
  return response.data;
};

export const togglePublishHangman = async (
  gameId: string,
  isPublish: boolean,
) => {
  const formData = new FormData();
  formData.append("is_publish", String(isPublish));

  const response = await api.patch(
    `/api/game/game-type/hangman/${gameId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const unpublishHangman = async (gameId: string) => {
  const response = await api.post(
    `/api/game/game-type/hangman/${gameId}/unpublish`,
    {},
  );
  return response.data;
};

export const saveGameResult = async (
  gameId: string,
  score: number,
  timeTaken?: number,
) => {
  const response = await api.post(
    `/api/game/game-type/hangman/${gameId}/result`,
    {
      score,
      time_taken: timeTaken,
    },
  );
  return response.data;
};

export const getHangmanLeaderboard = async (
  gameId: string,
  limit: number = 10,
): Promise<LeaderboardEntry[]> => {
  const response = await api.get(
    `/api/game/game-type/hangman/${gameId}/leaderboard`,
    {
      params: { limit },
    },
  );
  return response.data.data;
};
