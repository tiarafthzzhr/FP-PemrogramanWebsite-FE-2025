import { PuzzleGame } from './PuzzleGame';

export default function PuzzlePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Puzzle Game
        </h1>
        <PuzzleGame />
      </div>
    </div>
  );
}