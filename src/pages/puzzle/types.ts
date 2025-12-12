export type Difficulty = "easy" | "medium" | "hard";
export type GridSize = '3x3' | '4x4';


export interface Tile {
  id: number;
  value: number;
  isEmpty: boolean;
  position: { row: number; col: number };
}

export interface GameState {
  grid: Tile[][];
  moves: number;
  isCompleted: boolean;
  isPlaying: boolean;
  timeElapsed: number;
}

export interface PuzzleGameJson {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnail?: string;
  rows: number;
  cols: number;
  difficulty: Difficulty;
  timeLimitSec: number; 
}

export interface PuzzleGame {
  id: string;
  name: string;
  description?: string | null;
  thumbnail_image: string | null;
  is_published: boolean;
  creator_id: string;
  game_json: PuzzleGameJson;
  total_played: number;
  created_at: string;
}

export interface PuzzleSession {
  sessionId: string;
  gameId: string;
  gameJson: PuzzleGameJson;
}

// Untuk form create/edit (admin)
export interface PuzzleFormValues {
  name: string;
  description?: string;
  imageUrl: string;     
  thumbnail?: string; 
  rows: number;
  cols: number;
  difficulty: Difficulty;
  is_published?: boolean;
}