import { useState, useEffect } from 'react';

interface TimerProps {
  isPlaying: boolean;
  onTimeUpdate?: (time: number) => void;
}

export default function Timer({ isPlaying, onTimeUpdate }: TimerProps) {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isPlaying && !isPaused) {
      interval = window.setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isPaused, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <div className="text-2xl font-bold text-blue-600">
        {formatTime(time)}
      </div>
      <button
        onClick={() => setIsPaused(!isPaused)}
        disabled={!isPlaying}
        className={`px-4 py-2 rounded ${
          isPaused 
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
        } ${!isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
}