import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";

interface MatchUpProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  theme?: string;
  userName?: string;
}

interface MatchItem {
  id: string;
  content: string;
  value: number;
  type: "question" | "answer";
  matched: boolean;
}

export function MatchUp({ questions, onComplete, onExit }: MatchUpProps) {
  const [items, setItems] = useState<MatchItem[]>(() => {
    const matchItems: MatchItem[] = [];
    questions.slice(0, 8).forEach((q, i) => {
      matchItems.push({
        id: `q-${i}`,
        content: q.display,
        value: q.answer,
        type: "question",
        matched: false,
      });
      matchItems.push({
        id: `a-${i}`,
        content: q.answer.toString(),
        value: q.answer,
        type: "answer",
        matched: false,
      });
    });

    // Shuffle answers only
    const questions_part = matchItems.filter(
      (item) => item.type === "question",
    );
    const answers_part = matchItems.filter((item) => item.type === "answer");
    answers_part.sort(() => Math.random() - 0.5);

    return [...questions_part, ...answers_part];
  });

  const [selectedQuestion, setSelectedQuestion] = useState<MatchItem | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleItemClick = (item: MatchItem) => {
    if (item.matched) return;

    if (item.type === "question") {
      setSelectedQuestion(item);
    } else if (selectedQuestion) {
      // Matching answer with question
      if (selectedQuestion.value === item.value) {
        // Correct match!
        setItems(
          items.map((i) =>
            i.id === selectedQuestion.id || i.id === item.id
              ? { ...i, matched: true }
              : i,
          ),
        );
        setScore(score + 1);
        setSelectedQuestion(null);

        // Check if all matched
        const allMatched = items.every(
          (i) => i.id === selectedQuestion.id || i.id === item.id || i.matched,
        );
        if (allMatched) {
          setTimeout(() => setShowResult(true), 1000);
        }
      } else {
        // Wrong match - shake animation
        setSelectedQuestion(null);
      }
    }
  };

  if (showResult) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">All Matched! 🎉</h2>
          <div className="text-6xl mb-4">
            {score}/{Math.min(questions.length, 8)}
          </div>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Generator
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const questionItems = items.filter((i) => i.type === "question");
  const answerItems = items.filter((i) => i.type === "answer");

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 flex flex-col p-4 relative">
      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-white mb-2 text-2xl font-bold">Match Up</h2>
          <p className="text-white/90">
            Click a question, then click its matching answer
          </p>
          <div className="text-white mt-4">
            Matches: {score}/{Math.min(questions.length, 8)}
          </div>
        </div>

        {/* Match Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Questions Column */}
          <div className="space-y-3">
            {questionItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.matched}
                className={`w-full p-4 rounded-xl text-xl transition-all ${
                  item.matched
                    ? "bg-green-400 text-white"
                    : selectedQuestion?.id === item.id
                      ? "bg-white border-4 border-yellow-400"
                      : "bg-white hover:bg-gray-50 border-2 border-white"
                }`}
                whileHover={!item.matched ? { scale: 1.05 } : {}}
                whileTap={!item.matched ? { scale: 0.95 } : {}}
                layout
              >
                <div className="flex items-center justify-between">
                  <span>{item.content}</span>
                  {item.matched && <CheckCircle className="w-6 h-6" />}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Answers Column */}
          <div className="space-y-3">
            {answerItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.matched || !selectedQuestion}
                className={`w-full p-4 rounded-xl text-xl transition-all ${
                  item.matched
                    ? "bg-green-400 text-white"
                    : selectedQuestion
                      ? "bg-white hover:bg-yellow-50 border-2 border-white hover:border-yellow-400"
                      : "bg-white/50 cursor-not-allowed"
                }`}
                whileHover={
                  !item.matched && selectedQuestion ? { scale: 1.05 } : {}
                }
                whileTap={
                  !item.matched && selectedQuestion ? { scale: 0.95 } : {}
                }
                layout
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{item.content}</span>
                  {item.matched && <CheckCircle className="w-6 h-6" />}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
