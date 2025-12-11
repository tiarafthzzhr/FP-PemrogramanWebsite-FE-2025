interface ControlsProps {
  isPlaying: boolean;
  onPause: () => void;
  onRestart: () => void;
  onExit: () => void;
  moves: number;
}

export default function Controls({ 
  isPlaying, 
  onPause, 
  onRestart, 
  onExit,
  moves 
}: ControlsProps) {
  const handleExit = async () => {
    // Kirim POST request untuk increment play count
    try {
      await fetch('/api/games/puzzle/play-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to update play count:', error);
    }
    
      window.location.href = '/'; // ✅ Redirect ke home

    // Panggil callback exit
    onExit();
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white border rounded-lg">
      <div className="flex items-center gap-2">
        <span className="font-semibold">Moves:</span>
        <span className="text-blue-600 font-bold">{moves}</span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onPause}
          disabled={!isPlaying}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {isPlaying ? 'Pause' : 'Resume'}
        </button>
        
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Restart
        </button>
        
        <button
          onClick={handleExit}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Exit Game
        </button>
      </div>
    </div>
  );
}
