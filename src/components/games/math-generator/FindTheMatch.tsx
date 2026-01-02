import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { MathQuestion, GameSettings } from "../../../App";

interface FindTheMatchProps {
  questions: MathQuestion[];
  onComplete: () => void;
  onExit?: () => void;
  settings: GameSettings;
  userName?: string;
}

interface Card {
  id: string;
  content: string;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export function FindTheMatch({
  questions,
  onComplete,
  onExit,
}: FindTheMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Create pairs of cards
    const cardPairs: Card[] = [];
    questions.slice(0, 6).forEach((q, i) => {
      cardPairs.push({
        id: `q-${i}`,
        content: q.display,
        value: q.answer,
        isFlipped: false,
        isMatched: false,
      });
      cardPairs.push({
        id: `a-${i}`,
        content: q.answer.toString(),
        value: q.answer,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    cardPairs.sort(() => Math.random() - 0.5);
    setCards(cardPairs);
  }, [questions]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);

      if (flippedCards[0].value === flippedCards[1].value) {
        // Match found!
        setTimeout(() => {
          setCards(
            cards.map((card) =>
              card.id === flippedCards[0].id || card.id === flippedCards[1].id
                ? { ...card, isMatched: true }
                : card,
            ),
          );
          setScore(score + 1);
          setFlippedCards([]);

          // Check if all matched
          const allMatched = cards.every(
            (c) =>
              c.id === flippedCards[0].id ||
              c.id === flippedCards[1].id ||
              c.isMatched,
          );
          if (allMatched) {
            setTimeout(() => setShowResult(true), 1000);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(
            cards.map((card) =>
              card.id === flippedCards[0].id || card.id === flippedCards[1].id
                ? { ...card, isFlipped: false }
                : card,
            ),
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards]);

  const handleCardClick = (card: Card) => {
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    setCards(
      cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c)),
    );
    setFlippedCards([...flippedCards, card]);
  };

  if (showResult) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">All Matched! 🎉</h2>
          <div className="text-6xl mb-4">{moves}</div>
          <p className="text-gray-600 mb-6">Moves taken</p>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl"
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex flex-col p-4 relative">
      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          ← Exit Game
        </button>
      )}

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-white mb-1 text-2xl font-bold">Find the Match</h2>
          <p className="text-white/90 text-sm">
            Flip cards to find matching pairs
          </p>
          <div className="text-white mt-2 text-sm">
            Moves: {moves} | Matches: {score}/{Math.min(questions.length, 6)}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="aspect-square cursor-pointer"
              onClick={() => handleCardClick(card)}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
            >
              <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white to-pink-100 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                  }}
                >
                  <div className="text-6xl">❓</div>
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 rounded-2xl shadow-lg flex items-center justify-center p-4 border-4 ${
                    card.isMatched
                      ? "bg-gradient-to-br from-green-400 to-green-600 border-green-300"
                      : "bg-gradient-to-br from-blue-400 to-purple-600 border-blue-300"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="text-white text-center break-words">
                    {card.content}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
