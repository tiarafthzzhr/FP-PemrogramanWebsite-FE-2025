import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";

interface AirplaneProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  userName?: string;
}

interface Plane {
  id: string;
  answer: number;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
}

export function Airplane({ questions, onComplete, onExit }: AirplaneProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shotPlane, setShotPlane] = useState<string | null>(null);
  const [bullets, setBullets] = useState<
    { id: string; x: number; y: number; targetX: number; targetY: number }[]
  >([]);
  const [cannonAngle, setCannonAngle] = useState(0);

  const question = questions[currentQuestion];

  // Colorful plane colors
  const planeColors = [
    "text-blue-600",
    "text-purple-600",
    "text-pink-600",
    "text-orange-600",
    "text-teal-600",
    "text-indigo-600",
  ];

  // Track mouse position for cannon rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cannonX = window.innerWidth * 0.08; // 8% from left
      const cannonY = window.innerHeight * 0.5; // 50% from top

      const dx = e.clientX - cannonX;
      const dy = e.clientY - cannonY;

      // Calculate angle in degrees
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Clamp angle to prevent cannon from rotating too much (limit to -45 to 45 degrees)
      angle = Math.max(-45, Math.min(45, angle));

      setCannonAngle(angle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!question) return;

    // Create planes for current question with wave pattern
    const newPlanes: Plane[] =
      question.options?.map((option, i) => ({
        id: `${currentQuestion}-${i}`,
        answer: option,
        isCorrect: option === question.answer,
        x: -20 - i * 15, // Stagger start positions
        y: 15 + i * 20, // Base vertical position
        speed: 0.2 + Math.random() * 0.15,
      })) || [];

    setPlanes(newPlanes);
  }, [currentQuestion, question]);

  useEffect(() => {
    if (showResult) return;

    // Animate planes flying with wave pattern
    const interval = setInterval(() => {
      setPlanes((prev) =>
        prev.map((plane, idx) => {
          // Reset position if it goes off screen to loop them
          let newX = plane.x + plane.speed;
          if (newX > 110) newX = -20;

          // Add wave pattern: each plane has different wave offset
          const baseY = 15 + idx * 20;
          const waveAmplitude = 5; // How much up/down
          const waveFrequency = 0.05; // How often it waves
          const waveOffset = (idx * Math.PI) / 2; // Different phase for each plane
          const newY =
            baseY + Math.sin(newX * waveFrequency + waveOffset) * waveAmplitude;

          return {
            ...plane,
            x: newX,
            y: newY,
          };
        }),
      );
    }, 20); // Smoother animation

    return () => clearInterval(interval);
  }, [showResult]);

  useEffect(() => {
    // Animate bullets toward their targets
    const interval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((bullet) => {
            // Calculate direction vector
            const dx = bullet.targetX - bullet.x;
            const dy = bullet.targetY - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If close enough to target, remove bullet
            if (distance < 2) {
              return null;
            }

            // Normalize and move toward target
            const speed = 3;
            const newX = bullet.x + (dx / distance) * speed;
            const newY = bullet.y + (dy / distance) * speed;

            return {
              ...bullet,
              x: newX,
              y: newY,
            };
          })
          .filter(
            (
              bullet,
            ): bullet is {
              id: string;
              x: number;
              y: number;
              targetX: number;
              targetY: number;
            } => bullet !== null,
          ),
      );
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleShoot = (plane: Plane) => {
    if (shotPlane) return;

    // Calculate bullet target position (plane's current position)
    const bulletId = `bullet-${Date.now()}`;
    const bulletStartX = 8;
    const bulletStartY = 50;
    const targetX = plane.x;
    const targetY = plane.y + 12; // Aim for center of plane

    setBullets([
      ...bullets,
      {
        id: bulletId,
        x: bulletStartX,
        y: bulletStartY,
        targetX: targetX,
        targetY: targetY,
      },
    ]);

    // Calculate time for bullet to reach target
    const dx = targetX - bulletStartX;
    const dy = targetY - bulletStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const bulletSpeed = 3;
    const timeToHit = (distance / bulletSpeed) * 20; // 20ms per frame

    setTimeout(() => {
      setShotPlane(plane.id);

      if (plane.isCorrect) {
        setScore(score + 1);
      }

      // Both correct and wrong: move to next question after explosion
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setShotPlane(null);
          setBullets([]);
        } else {
          setShowResult(true);
        }
      }, 1000);
    }, timeToHit);
  };

  if (showResult) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">Mission Complete! ✈️</h2>
          <div className="text-6xl mb-4">
            {score}/{questions.length}
          </div>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Generator
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 relative cursor-crosshair">
      {/* Clouds Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 80}%`,
              scale: 0.5 + Math.random(),
            }}
            animate={{ x: ["-10%", "110%"] }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: i * -5,
            }}
          >
            <svg
              width="100"
              height="60"
              viewBox="0 0 100 60"
              fill="currentColor"
            >
              <path d="M20,40 Q30,20 50,40 T90,40 T20,40" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      {/* Header */}
      <div className="relative z-20 text-center pt-4 pb-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-3 max-w-md mx-auto mb-2 shadow-xl border-b-4 border-blue-800">
          <h3 className="text-blue-900 font-bold uppercase text-xs tracking-wider mb-1">
            Target
          </h3>
          <div className="text-4xl font-black text-slate-800">
            {question?.display}
          </div>
        </div>
        <div className="flex justify-center gap-4 text-white font-bold text-base drop-shadow-md">
          <span>
            Question: {currentQuestion + 1}/{questions.length}
          </span>
          <span>|</span>
          <span>Score: {score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 top-32 bottom-0">
        {/* Cannon / Player - Rotates with mouse */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="relative">
            {/* Cannon Body - Rotates */}
            <div
              className="w-24 h-12 bg-gray-800 rounded-r-full border-4 border-gray-600 shadow-2xl relative overflow-hidden transition-transform duration-100"
              style={{
                transform: `rotate(${cannonAngle}deg)`,
                transformOrigin: "left center",
              }}
            >
              <div className="absolute top-0 bottom-0 left-0 w-4 bg-gray-900/50"></div>
              <div className="absolute top-1/2 right-2 w-16 h-1 bg-white/10 -translate-y-1/2 rounded-full"></div>
            </div>
            {/* Base (doesn't rotate) */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-gray-700 rounded-full border-4 border-gray-500 flex items-center justify-center shadow-lg">
              <Target className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Bullets */}
        <AnimatePresence>
          {bullets.map((bullet) => (
            <motion.div
              key={bullet.id}
              className="absolute z-20"
              style={{
                left: `${bullet.x}%`,
                top: `${bullet.y}%`,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="w-6 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)] border border-yellow-200"></div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Planes */}
        <AnimatePresence>
          {planes.map((plane) => (
            <motion.div
              key={plane.id}
              className="absolute cursor-pointer z-10"
              style={{
                left: `${plane.x}%`,
                top: `${plane.y}%`,
              }}
              onClick={() => handleShoot(plane)}
              whileHover={{ scale: 1.1, zIndex: 50 }}
              whileTap={{ scale: 0.95 }}
            >
              {shotPlane === plane.id ? (
                // Explosion Effect
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative -top-10 -left-10"
                >
                  <div className="text-8xl filter drop-shadow-lg">💥</div>
                </motion.div>
              ) : (
                // The Plane - Colorful
                <div className="relative w-48 h-24">
                  {" "}
                  {/* Ukuran container pesawat diperbesar */}
                  <svg
                    viewBox="0 0 200 100"
                    className={`w-full h-full drop-shadow-xl ${planeColors[planes.indexOf(plane) % planeColors.length]}`}
                    fill="currentColor"
                  >
                    {/* Tail */}
                    <path
                      d="M 10 40 L 30 10 L 50 40 Z"
                      className="brightness-90"
                    />

                    {/* Main Body / Fuselage */}
                    <path
                      d="M 20 40 L 160 40 Q 190 50 160 60 L 20 60 Q 10 50 20 40 Z"
                      className="brightness-110"
                    />

                    {/* Cockpit window */}
                    <path
                      d="M 130 40 Q 150 40 155 45 L 130 45 Z"
                      fill="#bfdbfe"
                    />

                    {/* Top Wing */}
                    <path
                      d="M 60 40 L 90 10 L 110 40 Z"
                      className="brightness-125"
                    />

                    {/* Bottom Wing (Darker for depth) */}
                    <path
                      d="M 70 60 L 90 85 L 120 60 Z"
                      className="brightness-75"
                    />

                    {/* Propeller (Spinning) */}
                    <rect
                      x="185"
                      y="20"
                      width="4"
                      height="60"
                      fill="#475569"
                      className="animate-spin origin-center"
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                      }}
                    />
                  </svg>
                  {/* Answer Badge - BIGGER and CLEARER */}
                  <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full border-4 border-slate-200 flex items-center justify-center shadow-inner z-20">
                    <span className="text-2xl font-black text-slate-900">
                      {plane.answer}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Visual Ground line */}
      <div className="absolute bottom-0 w-full h-2 bg-white/20 backdrop-blur-sm"></div>
    </div>
  );
}
