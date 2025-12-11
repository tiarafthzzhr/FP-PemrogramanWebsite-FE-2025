import type { Tile } from './types';

interface PuzzleGridProps {
  grid: Tile[][];
  onTileClick: (tile: Tile) => void;
  gridSize: '3x3' | '4x4';
}

export default function PuzzleGrid({ grid, onTileClick, gridSize }: PuzzleGridProps) {
  const getGridClass = () => {
    return gridSize === '3x3' 
      ? 'grid-cols-3 gap-2 w-80 h-80'
      : 'grid-cols-4 gap-1.5 w-96 h-96';
  };

  return (
    <div className={`grid ${getGridClass()} bg-gray-200 p-4 rounded-lg`}>
      {grid.flat().map((tile) => (
        <div
          key={tile.id}
          onClick={() => onTileClick(tile)}
          className={`
            flex items-center justify-center 
            rounded-lg font-bold text-white
            transition-all duration-200
            ${tile.isEmpty 
              ? 'bg-transparent cursor-default' 
              : 'bg-blue-500 hover:bg-blue-600 cursor-pointer shadow-md'
            }
            ${getGridClass().includes('grid-cols-3') ? 'text-xl' : 'text-lg'}
          `}
        >
          {!tile.isEmpty && tile.value}
        </div>
      ))}
    </div>
  );
}