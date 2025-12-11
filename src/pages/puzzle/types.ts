export interface Tile {
  id: number;
  value: number;
  isEmpty: boolean;
  position: { row: number; col: number };
}

export type GridSize = '3x3' | '4x4';

export interface GameState {
  grid: Tile[][];
  moves: number;
  isCompleted: boolean;
  isPlaying: boolean;
  timeElapsed: number;
}