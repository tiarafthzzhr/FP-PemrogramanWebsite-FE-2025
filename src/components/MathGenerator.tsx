import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, X, Divide, Play, Settings } from "lucide-react";
import type { MathQuestion, GameSettings } from "../App";

interface MathGeneratorProps {
  templateName: string;
  onPlay: (questions: MathQuestion[], settings: GameSettings) => void;
}

export function MathGenerator({ templateName, onPlay }: MathGeneratorProps) {
  const [operation, setOperation] = useState<
    "addition" | "subtraction" | "multiplication" | "division"
  >("addition");
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(10);
  const [questionCount, setQuestionCount] = useState(10);

  const operations = [
    {
      id: "addition",
      name: "Addition",
      icon: Plus,
      symbol: "+",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "subtraction",
      name: "Subtraction",
      icon: Minus,
      symbol: "-",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "multiplication",
      name: "Multiplication",
      icon: X,
      symbol: "×",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "division",
      name: "Division",
      icon: Divide,
      symbol: "÷",
      color: "from-green-500 to-teal-500",
    },
  ];

  const generateQuestions = (): MathQuestion[] => {
    const questions: MathQuestion[] = [];

    for (let i = 0; i < questionCount; i++) {
      let num1 =
        Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      let num2 =
        Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      let answer = 0;
      let display = "";

      switch (operation) {
        case "addition":
          answer = num1 + num2;
          display = `${num1} + ${num2}`;
          break;
        case "subtraction":
          // Ensure positive results
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          display = `${num1} - ${num2}`;
          break;
        case "multiplication":
          answer = num1 * num2;
          display = `${num1} × ${num2}`;
          break;
        case "division":
          // Ensure clean division
          answer = num2;
          num1 =
            num2 *
            Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
          display = `${num1} ÷ ${num2}`;
          break;
      }

      // Generate wrong options
      const options = [answer];
      while (options.length < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const wrongAnswer = answer + offset;
        if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
          options.push(wrongAnswer);
        }
      }

      // Shuffle options
      options.sort(() => Math.random() - 0.5);

      questions.push({
        question: display,
        answer,
        options,
        display,
      });
    }

    return questions;
  };

  const handleGenerate = () => {
    const questions = generateQuestions();
    const settings: GameSettings = {
      operation,
      minNumber,
      maxNumber,
      questionCount,
    };
    onPlay(questions, settings);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8" />
            <h2>Configure Your Game</h2>
          </div>
          <p className="text-purple-100">Template: {templateName}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Operation Selection */}
          <div>
            <label className="block mb-4">Operation Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {operations.map((op) => {
                const Icon = op.icon;
                const isSelected = operation === op.id;
                return (
                  <motion.button
                    key={op.id}
                    onClick={() => setOperation(op.id as typeof operation)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${op.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm">{op.name}</div>
                      <div className="text-gray-500 text-sm">{op.symbol}</div>
                    </div>
                    {isSelected && (
                      <motion.div
                        layoutId="selected-operation"
                        className="absolute inset-0 border-2 border-purple-500 rounded-xl"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Number Range */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minNumber" className="block mb-2">
                Minimum Number
              </label>
              <input
                id="minNumber"
                type="number"
                min="0"
                max={maxNumber}
                value={minNumber}
                onChange={(e) =>
                  setMinNumber(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="maxNumber" className="block mb-2">
                Maximum Number
              </label>
              <input
                id="maxNumber"
                type="number"
                min={minNumber}
                max="100"
                value={maxNumber}
                onChange={(e) =>
                  setMaxNumber(
                    Math.max(minNumber, parseInt(e.target.value) || minNumber),
                  )
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label htmlFor="questionCount" className="block mb-2">
              Number of Questions: {questionCount}
            </label>
            <input
              id="questionCount"
              type="range"
              min="5"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>5 questions</span>
              <span>20 questions</span>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-100">
            <h3 className="mb-3">Preview</h3>
            <div className="flex items-center gap-2 text-gray-700">
              <span>Example:</span>
              <span className="px-4 py-2 bg-white rounded-lg shadow-sm">
                {minNumber} {operations.find((o) => o.id === operation)?.symbol}{" "}
                {maxNumber}
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6" />
            <span>Start Playing</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
