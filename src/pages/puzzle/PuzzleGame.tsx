import { useState, useEffect } from 'react';
import type { Tile, GridSize } from './types';
import Timer from './timer';
import PuzzleGrid from './PuzzleGrid';
import Controls from './controls';

// Initial grid data
const createInitialGrid = (size: GridSize): Tile[][] => {
  const gridSize = size === '3x3' ? 3 : 4;
  const totalTiles = gridSize * gridSize;
  const tiles: Tile[] = [];

  for (let i = 0; i < totalTiles - 1; i++) {
    tiles.push({
      id: i,
      value: i + 1,
      isEmpty: false,
      position: { row: Math.floor(i / gridSize), col: i % gridSize }
    });
  }

  // Add empty tile
  tiles.push({
    id: totalTiles - 1,
    value: totalTiles,
    isEmpty: true,
    position: { row: gridSize - 1, col: gridSize - 1 }
  });

  // Convert to 2D grid
  const grid: Tile[][] = [];
  for (let i = 0; i < gridSize; i++) {
    grid.push(tiles.slice(i * gridSize, (i + 1) * gridSize));
  }

  return grid;
};

export function PuzzleGame() {
  const [gridSize, setGridSize] = useState<GridSize>('3x3');
  const [grid, setGrid] = useState<Tile[][]>(() => createInitialGrid('3x3'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);

  const resetGame = () => {
    setGrid(createInitialGrid(gridSize));
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
  };

  const handleTileMove = (tile: Tile) => {
    if (!isPlaying || tile.isEmpty) return;

    // Simple move logic - find empty adjacent tile
    const newGrid = grid.map(row => [...row]);
    // Implement your puzzle move logic here
    
    setGrid(newGrid);
    setMoves(prev => prev + 1);
  };

  const handleExit = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    resetGame();
  }, [gridSize]);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setGridSize('3x3')}
          className={`px-4 py-2 rounded ${
            gridSize === '3x3' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          3x3 Grid
        </button>
        <button 
          onClick={() => setGridSize('4x4')}
          className={`px-4 py-2 rounded ${
            gridSize === '4x4' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          4x4 Grid
        </button>
      </div>

      <Timer isPlaying={isPlaying} onTimeUpdate={setTime} />
      
      <PuzzleGrid 
        grid={grid} 
        onTileClick={handleTileMove} 
        gridSize={gridSize} 
      />
      
      <Controls 
        isPlaying={isPlaying}
        onPause={() => setIsPlaying(!isPlaying)}
        onRestart={resetGame}
        onExit={handleExit}
        moves={moves}
      />
    </div>
  );
}