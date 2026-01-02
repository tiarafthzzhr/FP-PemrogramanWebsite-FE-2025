import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  GripVertical,
  CheckCircle,
  XCircle,
  Target,
} from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";

interface RankOrderProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  userName?: string;
}

interface RankItem {
  id: string;
  display: string;
  value: number;
}

export function RankOrder({ questions, onComplete, onExit }: RankOrderProps) {
  const [items, setItems] = useState<RankItem[]>(() => {
    const rankItems = questions.slice(0, 4).map((q, i) => ({
      id: `item-${i}`,
      display: q.display,
      value: q.answer,
    }));

    // Shuffle items
    return [...rankItems].sort(() => Math.random() - 0.5);
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [draggedItem, setDraggedItem] = useState<RankItem | null>(null);

  const correctOrder = [...items].sort((a, b) => a.value - b.value);

  const handleDragStart = (item: RankItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: RankItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;
  };

  const handleDrop = (targetItem: RankItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIdx = items.findIndex((item) => item.id === draggedItem.id);
    const targetIdx = items.findIndex((item) => item.id === targetItem.id);

    const newItems = [...items];
    newItems.splice(draggedIdx, 1);
    newItems.splice(targetIdx, 0, draggedItem);

    setItems(newItems);
    setDraggedItem(null);
  };

  const handleCheck = () => {
    const correct = items.every((item, i) => item.id === correctOrder[i].id);
    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setTimeout(() => {
        setShowResult(true);
      }, 2000);
    }
  };

  const handleTryAgain = () => {
    setIsChecked(false);
  };

  if (showResult) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Perfect Order! 🎉</h2>
          <p className="text-gray-600 mb-6">
            You sorted all equations correctly!
          </p>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold"
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 flex items-center justify-center p-4 relative">
      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      <div
        className="flex flex-col max-w-3xl w-full"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header - Bigger */}
        <div className="text-center mb-3">
          <h2 className="text-white text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Target className="w-7 h-7" />
            Rank Order
          </h2>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3 shadow-lg">
            <p className="text-purple-900 font-semibold text-sm mb-2">
              Drag to order: Smallest → Largest
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-600 font-medium">Smallest</span>
              <div className="flex-1 h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full" />
              <span className="text-xs text-green-600 font-medium">
                Largest
              </span>
            </div>
          </div>
        </div>

        {/* Ranking Area - Bigger and centered */}
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          style={{ maxHeight: "50vh" }}
        >
          <div
            className="space-y-3 p-4 overflow-y-auto"
            style={{ maxHeight: "50vh" }}
          >
            {items.map((item, index) => {
              const correctIndex = correctOrder.findIndex(
                (c) => c.id === item.id,
              );
              const isInCorrectPosition = isChecked && correctIndex === index;
              const isInWrongPosition = isChecked && correctIndex !== index;

              return (
                <div
                  key={item.id}
                  draggable={!isChecked}
                  onDragStart={() => handleDragStart(item)}
                  onDragOver={(e) => handleDragOver(e, item)}
                  onDrop={() => handleDrop(item)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isInCorrectPosition
                      ? "bg-green-50 border-green-400"
                      : isInWrongPosition
                        ? "bg-red-50 border-red-400"
                        : draggedItem?.id === item.id
                          ? "bg-purple-100 border-purple-500 opacity-50"
                          : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300"
                  } ${!isChecked ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical
                      className={`w-6 h-6 flex-shrink-0 ${
                        isChecked ? "text-gray-300" : "text-purple-400"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-2xl font-bold truncate">
                        {item.display} = {item.value}
                      </div>
                    </div>

                    {isInCorrectPosition && (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}

                    {isInWrongPosition && (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${
                        isInCorrectPosition
                          ? "bg-green-500 text-white"
                          : isInWrongPosition
                            ? "bg-red-500 text-white"
                            : "bg-purple-200 text-purple-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Button - Bigger */}
        <div className="mt-4">
          {!isChecked ? (
            <motion.button
              onClick={handleCheck}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✅ Check My Order
            </motion.button>
          ) : !isCorrect ? (
            <motion.button
              onClick={handleTryAgain}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl text-xl font-bold shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Try Again
            </motion.button>
          ) : null}

          {/* Feedback - Bigger */}
          {isChecked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-4 rounded-xl text-center text-lg font-bold ${
                isCorrect
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isCorrect ? (
                <>✓ Perfect! All in order!</>
              ) : (
                <>✗ Not quite right. Try again!</>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
