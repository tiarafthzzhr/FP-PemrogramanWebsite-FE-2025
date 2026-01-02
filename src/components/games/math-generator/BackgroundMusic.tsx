import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundMusicProps {
  autoPlay?: boolean;
}

export function BackgroundMusic({ autoPlay = false }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showMessage, setShowMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playlist of upbeat, educational background music (YouTube Audio Library - Free to use)
  // Using direct links to royalty-free music
  const musicTracks = [
    "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    "https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3",
  ];

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(musicTracks[0]);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Set to 30% volume

    // Play if autoPlay is enabled
    if (autoPlay) {
      audioRef.current.play().catch(() => {
        // Browser blocked autoplay
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <motion.button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-2xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 right-6 z-50 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg shadow-xl border border-gray-200"
          >
            <p className="text-sm font-semibold">
              {isPlaying ? "🎵 Music On" : "🔇 Music Off"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
