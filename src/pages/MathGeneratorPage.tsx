/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// API
import { createMathGenerator } from "@/api/mathGenerator/createMathGenerator";

// Components
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { FormField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/textarea-field";
import Dropzone from "@/components/ui/dropzone";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

// Game Components untuk Preview
import { Quiz } from "@/components/games/math-generator/Quiz";
import { MatchUp } from "@/components/games/math-generator/MatchUp";
import { TrueOrFalse } from "@/components/games/math-generator/TrueOrFalse";
import { FindTheMatch } from "@/components/games/math-generator/FindTheMatch";
import { WhackAMole } from "@/components/games/math-generator/WhackAMole";
import { GameshowQuiz } from "@/components/games/math-generator/GameshowQuiz";
import { BalloonPop } from "@/components/games/math-generator/BalloonPop";
import { MazeChase } from "@/components/games/math-generator/MazeChase";
import { RankOrder } from "@/components/games/math-generator/RankOrder";
import { Airplane } from "@/components/games/math-generator/Airplane";

// Theme System
import { getTheme, type ThemeConfig } from "@/lib/themes";

// Types
export interface MathQuestion {
  question: string;
  answer: number;
  options?: number[];
  display: string;
}

type OperationType = "addition" | "subtraction" | "multiplication" | "division";

export default function MathGeneratorPage() {
  const navigate = useNavigate();

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [customBackground, setCustomBackground] = useState<File | null>(null);

  // Operation Types (bisa multiple)
  const [selectedOperations, setSelectedOperations] = useState<OperationType[]>(
    ["addition"],
  );

  // Difficulty & Grade Level
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy",
  );
  const [gradeLevel, setGradeLevel] = useState<string>("sd-1-2");

  // Number Range (akan di-override berdasarkan grade level)
  const [minNumber, setMinNumber] = useState("1");
  const [maxNumber, setMaxNumber] = useState("10");
  const [questionCount, setQuestionCount] = useState("10");

  // Game Type
  const [selectedGameType, setSelectedGameType] = useState<string>("quiz");

  // Theme
  const [selectedTheme, setSelectedTheme] = useState<string>("default");

  // Scoring & Randomization
  const [scorePerQuestion, setScorePerQuestion] = useState("10");
  const [isAnswerRandomized, setIsAnswerRandomized] = useState(true);
  const [isQuestionRandomized, setIsQuestionRandomized] = useState(true);

  // Preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<MathQuestion[]>([]);

  const difficultyLevels = [
    {
      id: "easy",
      name: "Easy",
      icon: "😊",
      description: "Simple whole numbers only",
    },
    {
      id: "medium",
      name: "Medium",
      icon: "🤔",
      description: "Includes simple fractions",
    },
    {
      id: "hard",
      name: "Hard",
      icon: "🔥",
      description: "Complex fractions & decimals",
    },
  ];

  const gradeLevels = [
    {
      id: "sd-1-2",
      name: "SD Kelas 1-2",
      description: "Dasar untuk anak kelas 1-2",
    },
    { id: "sd-3-6", name: "SD Kelas 3-6", description: "Tingkat menengah SD" },
    {
      id: "smp-1-3",
      name: "SMP Kelas 1-3",
      description: "Tingkat menengah pertama",
    },
    {
      id: "sma-1-3",
      name: "SMA Kelas 1-3",
      description: "Tingkat menengah atas",
    },
  ];

  const gameTypes = [
    {
      id: "quiz",
      name: "Quiz",
      icon: "📝",
      description: "Standard multiple choice quiz",
    },
    {
      id: "truefalse",
      name: "True or False",
      icon: "✓✗",
      description: "True/false questions",
    },
    {
      id: "matchup",
      name: "Match Up",
      icon: "🔗",
      description: "Match questions with answers",
    },
    {
      id: "findmatch",
      name: "Find the Match",
      icon: "🎴",
      description: "Memory card matching game",
    },
    {
      id: "whackamole",
      name: "Whack-a-Mole",
      icon: "🔨",
      description: "Hit correct answers quickly",
    },
    {
      id: "gameshow",
      name: "Gameshow Quiz",
      icon: "📺",
      description: "TV-style gameshow format",
    },
    {
      id: "balloon",
      name: "Balloon Pop",
      icon: "🎈",
      description: "Pop balloons with correct answers",
    },
    {
      id: "maze",
      name: "Maze Chase",
      icon: "🏃",
      description: "Navigate through maze",
    },
    {
      id: "rankorder",
      name: "Rank Order",
      icon: "📊",
      description: "Order items correctly",
    },
    {
      id: "airplane",
      name: "Airplane",
      icon: "✈️",
      description: "Flying adventure game",
    },
  ];

  const themes = [
    {
      id: "default",
      name: "Default",
      icon: "🎨",
      preview: "bg-gradient-to-br from-blue-100 to-purple-100",
    },
    {
      id: "classroom",
      name: "Classroom",
      icon: "📚",
      preview: "bg-gradient-to-br from-amber-100 to-orange-100",
    },
    {
      id: "garden",
      name: "Garden",
      icon: "🌸",
      preview: "bg-gradient-to-br from-green-100 to-emerald-100",
    },
    {
      id: "ocean",
      name: "Ocean",
      icon: "🌊",
      preview: "bg-gradient-to-br from-cyan-100 to-blue-100",
    },
    {
      id: "space",
      name: "Space",
      icon: "🚀",
      preview: "bg-gradient-to-br from-indigo-100 to-purple-100",
    },
    {
      id: "forest",
      name: "Forest",
      icon: "🌲",
      preview: "bg-gradient-to-br from-green-200 to-teal-100",
    },
  ];

  const operationTypes: { id: OperationType; name: string; symbol: string }[] =
    [
      { id: "addition", name: "Addition", symbol: "+" },
      { id: "subtraction", name: "Subtraction", symbol: "−" },
      { id: "multiplication", name: "Multiplication", symbol: "×" },
      { id: "division", name: "Division", symbol: "÷" },
    ];

  const toggleOperation = (operation: OperationType) => {
    setSelectedOperations((prev) =>
      prev.includes(operation)
        ? prev.filter((op) => op !== operation)
        : [...prev, operation],
    );
  };

  const generateQuestions = (): MathQuestion[] => {
    const questions: MathQuestion[] = [];
    const count = parseInt(questionCount);

    // Use user-defined range
    const min = parseInt(minNumber);
    const max = parseInt(maxNumber);

    // Simple fractions for medium difficulty (SD 3-6, SMP)
    const simpleFractions = [
      { num: 1, den: 2, display: "1/2" },
      { num: 1, den: 4, display: "1/4" },
      { num: 3, den: 4, display: "3/4" },
      { num: 1, den: 3, display: "1/3" },
      { num: 2, den: 3, display: "2/3" },
      { num: 1, den: 5, display: "1/5" },
      { num: 2, den: 5, display: "2/5" },
    ];

    // Complex fractions for hard difficulty (SMP, SMA)
    const complexFractions = [
      { num: 3, den: 8, display: "3/8" },
      { num: 5, den: 6, display: "5/6" },
      { num: 7, den: 10, display: "7/10" },
      { num: 5, den: 12, display: "5/12" },
      { num: 7, den: 15, display: "7/15" },
      { num: 11, den: 20, display: "11/20" },
    ];

    // Advanced fractions for SMA hard
    const advancedFractions = [
      { num: 5, den: 7, display: "5/7" },
      { num: 3, den: 11, display: "3/11" },
      { num: 7, den: 9, display: "7/9" },
      { num: 4, den: 13, display: "4/13" },
      { num: 9, den: 17, display: "9/17" },
    ];

    // Helper function to calculate fraction result
    const addFractions = (f1: any, f2: any) => {
      const num = f1.num * f2.den + f2.num * f1.den;
      const den = f1.den * f2.den;
      return { num, den, display: `${num}/${den}` };
    };

    const subtractFractions = (f1: any, f2: any) => {
      const num = f1.num * f2.den - f2.num * f1.den;
      const den = f1.den * f2.den;
      return { num, den, display: `${num}/${den}` };
    };

    for (let i = 0; i < count; i++) {
      const operation =
        selectedOperations[
          Math.floor(Math.random() * selectedOperations.length)
        ];

      let num1: number;
      let num2: number;
      let answer: number | string;
      let display: string;
      let useFraction = false;

      // ===== GRADE LEVEL LOGIC =====

      // SD 1-2: Only EASY mode, simple addition/subtraction
      if (gradeLevel === "sd-1-2") {
        if (difficulty === "easy") {
          // Very simple: 1-20, only addition/subtraction
          const localMax = Math.min(max, 20);
          num1 = Math.floor(Math.random() * localMax) + 1;
          num2 = Math.floor(Math.random() * localMax) + 1;

          if (operation === "addition") {
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
          } else if (operation === "subtraction") {
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            display = `${num1} − ${num2}`;
          } else {
            // Force to addition if other operations selected
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
          }
        } else {
          // Medium/Hard still simple for SD 1-2
          const localMax = Math.min(max, 30);
          num1 = Math.floor(Math.random() * localMax) + 1;
          num2 = Math.floor(Math.random() * localMax) + 1;

          if (operation === "multiplication") {
            num1 = Math.min(num1, 10);
            num2 = Math.min(num2, 10);
            answer = num1 * num2;
            display = `${num1} × ${num2}`;
          } else if (operation === "addition") {
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
          } else {
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            display = `${num1} − ${num2}`;
          }
        }
      }

      // SD 3-6: Addition, subtraction, simple multiplication, division
      else if (gradeLevel === "sd-3-6") {
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * (max - min + 1)) + min;
          num2 = Math.floor(Math.random() * (max - min + 1)) + min;

          if (operation === "multiplication") {
            num1 = Math.min(num1, 12);
            num2 = Math.min(num2, 12);
            answer = num1 * num2;
            display = `${num1} × ${num2}`;
          } else if (operation === "division") {
            num2 = Math.max(Math.floor(Math.random() * 10) + 1, 1);
            num1 = num2 * Math.floor(Math.random() * 12 + 1);
            answer = num1 / num2;
            display = `${num1} ÷ ${num2}`;
          } else if (operation === "addition") {
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
          } else {
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            display = `${num1} − ${num2}`;
          }
        } else if (difficulty === "medium") {
          // Simple fractions (30% chance)
          if (
            Math.random() > 0.7 &&
            (operation === "addition" || operation === "subtraction")
          ) {
            const frac1 =
              simpleFractions[
                Math.floor(Math.random() * simpleFractions.length)
              ];
            const frac2 =
              simpleFractions[
                Math.floor(Math.random() * simpleFractions.length)
              ];

            const result =
              operation === "addition"
                ? addFractions(frac1, frac2)
                : subtractFractions(frac1, frac2);
            answer = result.display;
            display = `${frac1.display} ${operation === "addition" ? "+" : "−"} ${frac2.display}`;
            useFraction = true;
          } else {
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;

            if (operation === "multiplication") {
              answer = num1 * num2;
              display = `${num1} × ${num2}`;
            } else if (operation === "division") {
              num2 = Math.max(num2, 1);
              num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
              answer = num1 / num2;
              display = `${num1} ÷ ${num2}`;
            } else if (operation === "addition") {
              answer = num1 + num2;
              display = `${num1} + ${num2}`;
            } else {
              if (num1 < num2) [num1, num2] = [num2, num1];
              answer = num1 - num2;
              display = `${num1} − ${num2}`;
            }
          }
        } else {
          // Hard: More complex fractions (50% chance)
          if (
            Math.random() > 0.5 &&
            (operation === "addition" || operation === "subtraction")
          ) {
            const frac1 =
              complexFractions[
                Math.floor(Math.random() * complexFractions.length)
              ];
            const frac2 =
              complexFractions[
                Math.floor(Math.random() * complexFractions.length)
              ];

            const result =
              operation === "addition"
                ? addFractions(frac1, frac2)
                : subtractFractions(frac1, frac2);
            answer = result.display;
            display = `${frac1.display} ${operation === "addition" ? "+" : "−"} ${frac2.display}`;
            useFraction = true;
          } else {
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;

            if (operation === "multiplication") {
              answer = num1 * num2;
              display = `${num1} × ${num2}`;
            } else if (operation === "division") {
              num2 = Math.max(num2, 1);
              num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
              answer = num1 / num2;
              display = `${num1} ÷ ${num2}`;
            } else if (operation === "addition") {
              answer = num1 + num2;
              display = `${num1} + ${num2}`;
            } else {
              answer = num1 - num2;
              display = `${num1} − ${num2}`;
            }
          }
        }
      }

      // SMP 1-3: More complex operations with fractions
      else if (gradeLevel === "smp-1-3") {
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * (max - min + 1)) + min;
          num2 = Math.floor(Math.random() * (max - min + 1)) + min;

          if (operation === "multiplication") {
            answer = num1 * num2;
            display = `${num1} × ${num2}`;
          } else if (operation === "division") {
            num2 = Math.max(num2, 1);
            num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
            answer = num1 / num2;
            display = `${num1} ÷ ${num2}`;
          } else if (operation === "addition") {
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
          } else {
            answer = num1 - num2;
            display = `${num1} − ${num2}`;
          }
        } else if (difficulty === "medium") {
          // Fractions 40% of the time
          if (
            Math.random() > 0.6 &&
            (operation === "addition" || operation === "subtraction")
          ) {
            const frac1 =
              simpleFractions[
                Math.floor(Math.random() * simpleFractions.length)
              ];
            const frac2 =
              simpleFractions[
                Math.floor(Math.random() * simpleFractions.length)
              ];

            const result =
              operation === "addition"
                ? addFractions(frac1, frac2)
                : subtractFractions(frac1, frac2);
            answer = result.display;
            display = `${frac1.display} ${operation === "addition" ? "+" : "−"} ${frac2.display}`;
            useFraction = true;
          } else {
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;

            if (operation === "multiplication") {
              answer = num1 * num2;
              display = `${num1} × ${num2}`;
            } else if (operation === "division") {
              num2 = Math.max(num2, 1);
              num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
              answer = num1 / num2;
              display = `${num1} ÷ ${num2}`;
            } else if (operation === "addition") {
              answer = num1 + num2;
              display = `${num1} + ${num2}`;
            } else {
              answer = num1 - num2;
              display = `${num1} − ${num2}`;
            }
          }
        } else {
          // Hard: Complex fractions 60%
          if (
            Math.random() > 0.4 &&
            (operation === "addition" || operation === "subtraction")
          ) {
            const frac1 =
              complexFractions[
                Math.floor(Math.random() * complexFractions.length)
              ];
            const frac2 =
              complexFractions[
                Math.floor(Math.random() * complexFractions.length)
              ];

            const result =
              operation === "addition"
                ? addFractions(frac1, frac2)
                : subtractFractions(frac1, frac2);
            answer = result.display;
            display = `${frac1.display} ${operation === "addition" ? "+" : "−"} ${frac2.display}`;
            useFraction = true;
          } else {
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;

            if (operation === "multiplication" || operation === "division") {
              num2 = Math.max(num2, 1);
              if (operation === "division") {
                num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
              }
              answer =
                operation === "multiplication" ? num1 * num2 : num1 / num2;
              display = `${num1} ${operation === "multiplication" ? "×" : "÷"} ${num2}`;
            } else {
              answer = operation === "addition" ? num1 + num2 : num1 - num2;
              display = `${num1} ${operation === "addition" ? "+" : "−"} ${num2}`;
            }
          }
        }
      }

      // SMA 1-3: Advanced operations
      else if (gradeLevel === "sma-1-3") {
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * (max - min + 1)) + min;
          num2 = Math.floor(Math.random() * (max - min + 1)) + min;

          if (operation === "multiplication") {
            answer = num1 * num2;
            display = `${num1} × ${num2}`;
          } else if (operation === "division") {
            num2 = Math.max(num2, 1);
            num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
            answer = num1 / num2;
            display = `${num1} ÷ ${num2}`;
          } else if (operation === "addition") {
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
          } else {
            answer = num1 - num2;
            display = `${num1} − ${num2}`;
          }
        } else if (difficulty === "medium") {
          // Complex fractions 50%
          if (
            Math.random() > 0.5 &&
            (operation === "addition" || operation === "subtraction")
          ) {
            const frac1 =
              complexFractions[
                Math.floor(Math.random() * complexFractions.length)
              ];
            const frac2 =
              complexFractions[
                Math.floor(Math.random() * complexFractions.length)
              ];

            const result =
              operation === "addition"
                ? addFractions(frac1, frac2)
                : subtractFractions(frac1, frac2);
            answer = result.display;
            display = `${frac1.display} ${operation === "addition" ? "+" : "−"} ${frac2.display}`;
            useFraction = true;
          } else {
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;

            if (operation === "multiplication" || operation === "division") {
              num2 = Math.max(num2, 1);
              if (operation === "division") {
                num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
              }
              answer =
                operation === "multiplication" ? num1 * num2 : num1 / num2;
              display = `${num1} ${operation === "multiplication" ? "×" : "÷"} ${num2}`;
            } else {
              answer = operation === "addition" ? num1 + num2 : num1 - num2;
              display = `${num1} ${operation === "addition" ? "+" : "−"} ${num2}`;
            }
          }
        } else {
          // Hard: Advanced fractions 70%
          if (
            Math.random() > 0.3 &&
            (operation === "addition" || operation === "subtraction")
          ) {
            const frac1 =
              advancedFractions[
                Math.floor(Math.random() * advancedFractions.length)
              ];
            const frac2 =
              advancedFractions[
                Math.floor(Math.random() * advancedFractions.length)
              ];

            const result =
              operation === "addition"
                ? addFractions(frac1, frac2)
                : subtractFractions(frac1, frac2);
            answer = result.display;
            display = `${frac1.display} ${operation === "addition" ? "+" : "−"} ${frac2.display}`;
            useFraction = true;
          } else {
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;

            if (operation === "multiplication" || operation === "division") {
              num2 = Math.max(num2, 1);
              if (operation === "division") {
                num1 = num2 * Math.floor(Math.random() * (max - min + 1) + min);
              }
              answer =
                operation === "multiplication" ? num1 * num2 : num1 / num2;
              display = `${num1} ${operation === "multiplication" ? "×" : "÷"} ${num2}`;
            } else {
              answer = operation === "addition" ? num1 + num2 : num1 - num2;
              display = `${num1} ${operation === "addition" ? "+" : "−"} ${num2}`;
            }
          }
        }
      }

      // Generate wrong options based on question type
      const options = [answer];
      while (options.length < 4) {
        let wrongAnswer: number | string;

        if (useFraction) {
          // Generate wrong fraction answers
          const wrongNum =
            typeof answer === "string" ? parseInt(answer.split("/")[0]) : 0;
          const wrongDen =
            typeof answer === "string" ? parseInt(answer.split("/")[1]) : 1;

          const offset = Math.floor(Math.random() * 5) - 2;
          wrongAnswer = `${wrongNum + offset}/${wrongDen}`;
        } else {
          // Generate wrong whole number answers
          const numAnswer =
            typeof answer === "number" ? answer : parseInt(answer as string);
          const offset = Math.floor(Math.random() * 20) - 10;
          wrongAnswer = numAnswer + offset;
        }

        if (!options.includes(wrongAnswer) && wrongAnswer !== answer) {
          options.push(wrongAnswer);
        }
      }

      // Shuffle options
      options.sort(() => Math.random() - 0.5);

      questions.push({
        question: `What is ${display}?`,
        answer: typeof answer === "string" ? answer : answer,
        options,
        display,
      });
    }

    return questions;
  };

  const handlePreview = () => {
    if (selectedOperations.length === 0) {
      toast.error("Please select at least one operation type");
      return;
    }

    const questions = generateQuestions();
    setPreviewQuestions(questions);
    setShowPreview(true);
  };

  const handleSubmit = async (isDraft = false) => {
    if (!title) {
      toast.error("Game title is required");
      return;
    }
    if (!thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }
    if (selectedOperations.length === 0) {
      toast.error("Please select at least one operation type");
      return;
    }

    try {
      // Convert operations array to single operation or 'random'
      const operation =
        selectedOperations.length > 1 ? "random" : selectedOperations[0];

      // Prepare request data
      const requestData = {
        name: title,
        description: description || undefined,
        thumbnail_image: thumbnail,
        is_publish_immediately: !isDraft,

        // Game Settings
        operation: operation,
        difficulty: difficulty,
        theme: selectedTheme,
        game_type: selectedGameType, // Now included in API request

        // Scoring & Randomization
        question_count: parseInt(questionCount),
        score_per_question: parseInt(scorePerQuestion),
        is_answer_randomized: isAnswerRandomized,
        is_question_randomized: isQuestionRandomized,

        // Additional data (for frontend reference)
        grade_level: gradeLevel,
        min_number: parseInt(minNumber),
        max_number: parseInt(maxNumber),
        custom_background: customBackground || undefined,
      };

      toast.loading(isDraft ? "Saving draft..." : "Publishing game...");

      const response = await createMathGenerator(requestData);

      toast.dismiss();

      if (response.success) {
        if (isDraft) {
          toast.success("Math game saved as draft!");
        } else {
          toast.success("Math game published successfully!");
        }
        navigate("/my-projects");
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Error creating math generator:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to create game. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/create-projects");
  };

  const renderPreviewGame = () => {
    const commonProps = {
      questions: previewQuestions,
      onComplete: () => setShowPreview(false),
      settings: {
        operation: selectedOperations[0],
        minNumber: parseInt(minNumber),
        maxNumber: parseInt(maxNumber),
        questionCount: parseInt(questionCount),
        difficulty: difficulty,
      },
      theme: selectedTheme,
    };

    switch (selectedGameType) {
      case "quiz":
        return <Quiz {...commonProps} />;
      case "matchup":
        return <MatchUp {...commonProps} />;
      case "truefalse":
        return <TrueOrFalse {...commonProps} />;
      case "findmatch":
        return <FindTheMatch {...commonProps} />;
      case "whackamole":
        return <WhackAMole {...commonProps} />;
      case "gameshow":
        return <GameshowQuiz {...commonProps} />;
      case "balloon":
        return <BalloonPop {...commonProps} />;
      case "maze":
        return <MazeChase {...commonProps} />;
      case "rankorder":
        return <RankOrder {...commonProps} />;
      case "airplane":
        return <Airplane {...commonProps} />;
      default:
        return <div>Game not found</div>;
    }
  };

  if (showPreview) {
    return (
      <div className="w-full h-screen bg-slate-50">
        <div className="bg-white border-b px-6 py-4">
          <Button variant="ghost" onClick={() => setShowPreview(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
        </div>
        {renderPreviewGame()}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col">
      <div className="bg-white h-fit w-full flex justify-between items-center px-8 py-4">
        <Button
          size="sm"
          variant="ghost"
          className="hidden md:flex"
          onClick={() => navigate("/create-projects")}
        >
          <ArrowLeft /> Back
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block md:hidden"
          onClick={() => navigate("/create-projects")}
        >
          <ArrowLeft />
        </Button>
      </div>

      <div className="w-full h-full p-8 justify-center items-center flex flex-col">
        <div className="max-w-3xl w-full space-y-6">
          <div>
            <Typography variant="h3">Create Math Generator Game</Typography>
            <Typography variant="p" className="mt-2">
              Build your math game by selecting operations, difficulty, and game
              type
            </Typography>
          </div>

          {/* Basic Info */}
          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <FormField
              required
              label="Game Title"
              placeholder="e.g., Addition Practice 1-10"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextareaField
              label="Description"
              placeholder="Describe your math game"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Dropzone
              required
              label="Thumbnail Image"
              allowedTypes={["image/png", "image/jpeg"]}
              maxSize={2 * 1024 * 1024}
              onChange={(file) => setThumbnail(file)}
            />
          </div>

          {/* Operation Types */}
          <div className="bg-white w-full h-full p-6 space-y-4 rounded-xl border">
            <div>
              <Label className="text-base font-semibold">
                Operation Types <span className="text-red-500">*</span>
              </Label>
              <Typography variant="muted" className="text-sm mt-1">
                Select one or more operations to include in your game
              </Typography>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {operationTypes.map((op) => (
                <div
                  key={op.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedOperations.includes(op.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleOperation(op.id)}
                >
                  <Checkbox
                    checked={selectedOperations.includes(op.id)}
                    onCheckedChange={() => toggleOperation(op.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{op.name}</div>
                    <div className="text-2xl text-gray-500">{op.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="bg-white w-full h-full p-6 space-y-4 rounded-xl border">
            <div>
              <Label className="text-base font-semibold">
                Difficulty Level <span className="text-red-500">*</span>
              </Label>
              <Typography variant="muted" className="text-sm mt-1">
                Choose the complexity of questions
              </Typography>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {difficultyLevels.map((level) => (
                <div
                  key={level.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                    difficulty === level.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setDifficulty(level.id as "easy" | "medium" | "hard")
                  }
                >
                  <div className="text-4xl mb-2">{level.icon}</div>
                  <div className="font-semibold mb-1">{level.name}</div>
                  <div className="text-xs text-gray-600">
                    {level.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Level */}
          <div className="bg-white w-full h-full p-6 space-y-4 rounded-xl border">
            <div>
              <Label className="text-base font-semibold">
                Grade Level <span className="text-red-500">*</span>
              </Label>
              <Typography variant="muted" className="text-sm mt-1">
                Select target grade level for students
              </Typography>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {gradeLevels.map((grade) => (
                <div
                  key={grade.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    gradeLevel === grade.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setGradeLevel(grade.id)}
                >
                  <div className="font-semibold mb-1">{grade.name}</div>
                  <div className="text-xs text-gray-600">
                    {grade.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Settings - Number Range & Question Count */}
          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <div>
              <Label className="text-base font-semibold">Game Settings</Label>
              <Typography variant="muted" className="text-sm mt-1">
                Customize number range and question count
              </Typography>
            </div>

            {/* Number Range */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                required
                label="Minimum Number"
                type="number"
                placeholder="1"
                value={minNumber}
                onChange={(e) => setMinNumber(e.target.value)}
              />

              <FormField
                required
                label="Maximum Number"
                type="number"
                placeholder="100"
                value={maxNumber}
                onChange={(e) => setMaxNumber(e.target.value)}
              />
            </div>

            {/* Question Count with Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  Number of Questions
                </Label>
                <span className="text-2xl font-bold text-blue-600">
                  {questionCount}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 question</span>
                <span>25 questions</span>
                <span>50 questions</span>
              </div>
            </div>
          </div>

          {/* Game Type Selection */}
          <div className="bg-white w-full h-full p-6 space-y-4 rounded-xl border">
            <div>
              <Label className="text-base font-semibold">
                Game Type <span className="text-red-500">*</span>
              </Label>
              <Typography variant="muted" className="text-sm mt-1">
                Choose how players will interact with the questions
              </Typography>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
              {gameTypes.map((game) => (
                <Card
                  key={game.id}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    selectedGameType === game.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedGameType(game.id)}
                >
                  <div className="text-3xl mb-2">{game.icon}</div>
                  <div className="font-semibold text-sm mb-1">{game.name}</div>
                  <Typography variant="muted" className="text-xs">
                    {game.description}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>

          {/* Scoring & Randomization */}
          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <div>
              <Label className="text-base font-semibold">
                Scoring & Options
              </Label>
              <Typography variant="muted" className="text-sm mt-1">
                Configure scoring and question randomization
              </Typography>
            </div>

            {/* Score per Question */}
            <div className="space-y-2">
              <Label htmlFor="score">
                Score per Question <span className="text-red-500">*</span>
              </Label>
              <FormField
                id="score"
                type="number"
                placeholder="e.g., 10"
                value={scorePerQuestion}
                onChange={(e) => setScorePerQuestion(e.target.value)}
                min="1"
                max="1000"
              />
              <Typography variant="muted" className="text-xs">
                Points awarded for each correct answer
              </Typography>
            </div>

            {/* Randomization Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="randomize-answers"
                  checked={isAnswerRandomized}
                  onCheckedChange={(checked) =>
                    setIsAnswerRandomized(checked as boolean)
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="randomize-answers" className="cursor-pointer">
                    Randomize Answer Options
                  </Label>
                  <Typography variant="muted" className="text-xs">
                    Shuffle answer choices for each question
                  </Typography>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="randomize-questions"
                  checked={isQuestionRandomized}
                  onCheckedChange={(checked) =>
                    setIsQuestionRandomized(checked as boolean)
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor="randomize-questions"
                    className="cursor-pointer"
                  >
                    Randomize Question Order
                  </Label>
                  <Typography variant="muted" className="text-xs">
                    Display questions in random order for each playthrough
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="bg-white w-full h-full p-6 space-y-4 rounded-xl border">
            <div>
              <Label className="text-base font-semibold">Theme</Label>
              <Typography variant="muted" className="text-sm mt-1">
                Choose a visual theme for your game
              </Typography>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`cursor-pointer transition-all rounded-lg border-2 overflow-hidden ${
                    selectedTheme === theme.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div
                    className={`h-20 ${theme.preview} flex items-center justify-center text-3xl`}
                  >
                    {theme.icon}
                  </div>
                  <div className="p-2 bg-white text-center">
                    <div className="font-medium text-xs">{theme.name}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Background Upload (Only for Default Theme) */}
            {selectedTheme === "default" && (
              <div className="mt-4 pt-4 border-t">
                <Label className="text-sm font-medium mb-2 block">
                  Custom Background (Optional)
                </Label>
                <Typography variant="muted" className="text-xs mb-3">
                  Upload your own background image for the default theme
                </Typography>
                <Dropzone
                  onChange={(files) => setCustomBackground(files?.[0] || null)}
                  className="w-full"
                  fileExtension="image"
                />
                {customBackground && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {customBackground.name}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Preview Section */}
          {selectedOperations.length > 0 && (
            <div className="bg-white w-full h-full p-6 space-y-4 rounded-xl border">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-base font-semibold">
                    Live Preview
                  </Label>
                  <Typography variant="muted" className="text-sm mt-1">
                    See how your game will look
                  </Typography>
                </div>
                <Button
                  onClick={() => {
                    const questions = generateQuestions();
                    setPreviewQuestions(questions);
                    setShowPreview(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  🎮 Play Preview
                </Button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <div
                  className={`min-h-[400px] relative flex items-center justify-center ${getTheme(selectedTheme).background}`}
                  style={{
                    backgroundImage:
                      customBackground && selectedTheme === "default"
                        ? `url('${URL.createObjectURL(customBackground)}')`
                        : getTheme(selectedTheme).backgroundImage
                          ? `url('${getTheme(selectedTheme).backgroundImage}')`
                          : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay based on theme */}
                  <div
                    className={getTheme(selectedTheme).backgroundOverlay || ""}
                    style={{ position: "absolute", inset: 0 }}
                  />

                  <div className="relative z-10 w-full max-w-2xl p-6">
                    {/* Sample Question Card - berbeda per game type */}
                    {(() => {
                      const theme = getTheme(selectedTheme);
                      const sampleQuestion = selectedOperations.includes(
                        "addition",
                      )
                        ? "5 + 3"
                        : selectedOperations.includes("subtraction")
                          ? "8 − 3"
                          : selectedOperations.includes("multiplication")
                            ? "4 × 2"
                            : selectedOperations.includes("division")
                              ? "10 ÷ 2"
                              : "5 + 3";

                      const cardClass = `p-6 shadow-2xl ${theme.cardBg} ${theme.cardShape} border ${theme.cardBorder} ${theme.fontFamily || "font-sans"}`;
                      const buttonClass = `${theme.buttonBg} ${theme.buttonHover} ${theme.buttonShape} ${theme.buttonText || "text-white"} font-semibold transition-colors`;
                      const optionClass = `${theme.optionBg} ${theme.optionShape} border ${theme.optionBorder} ${theme.optionHoverBg} ${theme.optionText || theme.primaryText} font-semibold transition-colors`;

                      switch (selectedGameType) {
                        case "quiz":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-sm mb-2 ${theme.secondaryText}`}
                                >
                                  What is the answer?
                                </div>
                                <div
                                  className={`text-5xl font-bold mb-4 ${theme.primaryText}`}
                                >
                                  {sampleQuestion} = ?
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {[8, 6, 7, 9].map((num, idx) => (
                                  <div
                                    key={idx}
                                    className={`${optionClass} p-6 text-center text-2xl cursor-pointer`}
                                  >
                                    {num}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        case "truefalse":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-sm mb-3 ${theme.secondaryText}`}
                                >
                                  Is this equation correct?
                                </div>
                                <div
                                  className={`text-6xl font-bold mb-6 ${theme.primaryText}`}
                                >
                                  {sampleQuestion} = 8
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div
                                  className={`${buttonClass} p-8 text-center text-2xl flex flex-col items-center gap-3 cursor-pointer`}
                                >
                                  <div className="text-4xl">✓</div>
                                  <span>TRUE</span>
                                </div>
                                <div
                                  className={`${buttonClass} p-8 text-center text-2xl flex flex-col items-center gap-3 cursor-pointer`}
                                >
                                  <div className="text-4xl">✗</div>
                                  <span>FALSE</span>
                                </div>
                              </div>
                            </div>
                          );

                        case "matchup":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-lg font-semibold mb-2 ${theme.primaryText}`}
                                >
                                  Match the pairs
                                </div>
                                <div
                                  className={`text-sm ${theme.secondaryText}`}
                                >
                                  Tap to connect question with answer
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  {["5 + 3", "4 × 2", "10 ÷ 2"].map(
                                    (q, idx) => (
                                      <div
                                        key={idx}
                                        className={`${optionClass} p-4 text-center text-lg cursor-pointer`}
                                      >
                                        {q}
                                      </div>
                                    ),
                                  )}
                                </div>
                                <div className="space-y-3">
                                  {["8", "5", "12"].map((a, idx) => (
                                    <div
                                      key={idx}
                                      className={`${optionClass} p-4 text-center text-lg cursor-pointer`}
                                    >
                                      {a}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );

                        case "findmatch":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-lg font-semibold mb-2 ${theme.primaryText}`}
                                >
                                  Memory Match
                                </div>
                                <div
                                  className={`text-sm ${theme.secondaryText}`}
                                >
                                  Find all matching pairs
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                  <div
                                    key={i}
                                    className={`aspect-square ${i <= 2 ? theme.cardBg : theme.optionBg} ${theme.optionShape} border ${theme.optionBorder} flex items-center justify-center text-2xl font-bold ${theme.primaryText} cursor-pointer`}
                                  >
                                    {i <= 2 ? "8" : "?"}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        case "whackamole":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-lg font-semibold mb-2 ${theme.primaryText}`}
                                >
                                  Whack the correct answer!
                                </div>
                                <div
                                  className={`text-4xl font-bold mb-3 ${theme.primaryText}`}
                                >
                                  {sampleQuestion} = ?
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                {[
                                  { num: 8, mole: "🐹", visible: true },
                                  { num: null, mole: null, visible: false },
                                  { num: 6, mole: "🐭", visible: true },
                                  { num: null, mole: null, visible: false },
                                  { num: null, mole: null, visible: false },
                                  { num: 7, mole: "🐹", visible: true },
                                  { num: 9, mole: "🐭", visible: false },
                                  { num: null, mole: null, visible: false },
                                  { num: 5, mole: "🐭", visible: false },
                                ].map((hole, idx) => (
                                  <div
                                    key={idx}
                                    className="aspect-square relative"
                                  >
                                    {/* Grass Background with Hole - Theme Aware */}
                                    <div
                                      className={`w-full h-full ${theme.optionBg} ${theme.optionShape} shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)] border-b-8 ${theme.optionBorder} relative overflow-hidden`}
                                    >
                                      {/* The Dark Hole */}
                                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-black/40 rounded-[100%] blur-sm" />
                                      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-4/5 h-2/5 bg-black/60 rounded-[50%]" />

                                      {/* Mole Character */}
                                      {hole.visible && hole.num && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 z-10">
                                          {/* Mole Body - Theme Aware */}
                                          <div
                                            className={`w-3/4 h-[85%] ${theme.optionShape} shadow-xl relative flex flex-col items-center pt-2 border-4 ${theme.optionBorder} ${
                                              hole.mole === "🐹"
                                                ? theme.correctColor.replace(
                                                    "bg-",
                                                    "bg-gradient-to-b from-",
                                                  ) +
                                                  " to-" +
                                                  theme.correctColor.replace(
                                                    "bg-",
                                                    "",
                                                  ) +
                                                  "-700"
                                                : theme.wrongColor.replace(
                                                    "bg-",
                                                    "bg-gradient-to-b from-",
                                                  ) +
                                                  " to-" +
                                                  theme.wrongColor.replace(
                                                    "bg-",
                                                    "",
                                                  ) +
                                                  "-700"
                                            }`}
                                          >
                                            {/* Mole Face */}
                                            <div className="text-3xl drop-shadow-md mb-1">
                                              {hole.mole}
                                            </div>
                                            {/* Answer Badge - Theme Aware */}
                                            <div
                                              className={`${theme.cardBg} w-4/5 py-1 ${theme.cardShape} shadow-lg flex items-center justify-center border-b-4 ${theme.cardBorder}`}
                                            >
                                              <span
                                                className={`text-2xl font-black ${theme.primaryText}`}
                                              >
                                                {hole.num}
                                              </span>
                                            </div>
                                            {/* Little Hands - inherit dari body */}
                                            <div className="absolute top-12 -left-1 w-3 h-6 bg-inherit rounded-full -rotate-45" />
                                            <div className="absolute top-12 -right-1 w-3 h-6 bg-inherit rounded-full rotate-45" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        case "gameshow":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-2xl font-bold mb-4 ${theme.primaryText}`}
                                >
                                  🎮 Question Time!
                                </div>
                                <div
                                  className={`text-5xl font-bold mb-4 ${theme.primaryText}`}
                                >
                                  {sampleQuestion} = ?
                                </div>
                              </div>
                              <div className="space-y-3">
                                {["A: 8", "B: 6", "C: 7", "D: 9"].map(
                                  (opt, idx) => (
                                    <div
                                      key={idx}
                                      className={`${optionClass} p-5 text-xl cursor-pointer`}
                                    >
                                      {opt}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          );

                        case "balloon":
                          return (
                            <div className={`${cardClass} overflow-visible`}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-lg font-semibold mb-2 ${theme.primaryText}`}
                                >
                                  Pop the correct answer!
                                </div>
                                <div
                                  className={`text-4xl font-bold ${theme.primaryText}`}
                                >
                                  {sampleQuestion} = ?
                                </div>
                              </div>
                              <div className="flex justify-center gap-8 pt-4">
                                {[8, 6, 7].map((num, idx) => (
                                  <div
                                    key={idx}
                                    className="relative cursor-pointer"
                                  >
                                    <div
                                      className={`w-20 h-24 ${["bg-gradient-to-br from-red-400 to-red-600", "bg-gradient-to-br from-blue-400 to-blue-600", "bg-gradient-to-br from-green-400 to-green-600"][idx]} rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
                                    >
                                      {num}
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-400"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        case "maze":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-lg font-semibold mb-2 ${theme.primaryText}`}
                                >
                                  Navigate to the answer
                                </div>
                                <div
                                  className={`text-4xl font-bold ${theme.primaryText}`}
                                >
                                  {sampleQuestion} = ?
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {[
                                  "🏁",
                                  8,
                                  "🧱",
                                  6,
                                  "🧱",
                                  7,
                                  "🧱",
                                  "🧱",
                                  9,
                                  "🧱",
                                  5,
                                  "🧱",
                                  "🧱",
                                  "🧱",
                                  "🧱",
                                  8,
                                ].map((item, idx) => (
                                  <div
                                    key={idx}
                                    className={`aspect-square ${typeof item === "number" ? theme.optionBg : item === "🏁" ? "bg-yellow-200" : "bg-gray-600"} ${theme.optionShape} flex items-center justify-center text-xl font-bold ${theme.primaryText}`}
                                  >
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        case "rankorder":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-6">
                                <div
                                  className={`text-lg font-semibold mb-2 ${theme.primaryText}`}
                                >
                                  Rank Order
                                </div>
                                <div
                                  className={`text-sm ${theme.secondaryText}`}
                                >
                                  Drag to order from smallest to largest
                                </div>
                              </div>
                              <div className="space-y-3">
                                {[
                                  "2 + 2 = 4",
                                  "5 + 3 = 8",
                                  "4 × 2 = 8",
                                  "10 ÷ 2 = 5",
                                ].map((eq, idx) => (
                                  <div
                                    key={idx}
                                    className={`${optionClass} p-4 flex items-center gap-3 cursor-move`}
                                  >
                                    <span
                                      className={`${theme.secondaryText} text-xl`}
                                    >
                                      ☰
                                    </span>{" "}
                                    {eq}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        case "airplane":
                          return (
                            <div className={cardClass}>
                              <div className="text-center mb-4">
                                <div
                                  className={`text-lg font-semibold mb-2 ${theme.primaryText}`}
                                >
                                  Fly through the answer!
                                </div>
                                <div
                                  className={`text-4xl font-bold ${theme.primaryText}`}
                                >
                                  {sampleQuestion} = ?
                                </div>
                              </div>
                              <div className="relative h-48 mt-6">
                                <div className="absolute top-8 left-8 text-6xl">
                                  ✈️
                                </div>
                                {[8, 6, 7].map((num, idx) => (
                                  <div
                                    key={idx}
                                    className={`absolute ${idx === 0 ? "top-4 right-16" : idx === 1 ? "bottom-8 right-24" : "top-16 right-8"} w-16 h-16 ${theme.optionBg} ${theme.optionShape} border ${theme.optionBorder} flex items-center justify-center text-xl font-bold ${theme.primaryText} shadow-lg cursor-pointer`}
                                  >
                                    {num}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        default:
                          return (
                            <div className={cardClass}>
                              <div className="text-center">
                                <div
                                  className={`text-4xl font-bold ${theme.primaryText}`}
                                >
                                  {sampleQuestion}
                                </div>
                              </div>
                            </div>
                          );
                      }
                    })()}

                    {/* Info Badge */}
                    <div className="mt-6 text-center space-y-2">
                      <div className="inline-block bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full text-sm text-gray-600 shadow-md">
                        {gameTypes.find((g) => g.id === selectedGameType)?.icon}{" "}
                        {gameTypes.find((g) => g.id === selectedGameType)?.name}{" "}
                        • {themes.find((t) => t.id === selectedTheme)?.icon}{" "}
                        {themes.find((t) => t.id === selectedTheme)?.name}
                      </div>
                      <div className="flex gap-2 justify-center">
                        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-medium">
                          {
                            difficultyLevels.find((d) => d.id === difficulty)
                              ?.icon
                          }{" "}
                          {
                            difficultyLevels.find((d) => d.id === difficulty)
                              ?.name
                          }
                        </div>
                        <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-medium">
                          📚{" "}
                          {gradeLevels.find((g) => g.id === gradeLevel)?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Game Preview Modal */}
          {showPreview && previewQuestions.length > 0 && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <div>
                    <Typography variant="h3">🎮 Game Preview</Typography>
                    <Typography variant="muted" className="text-sm">
                      {gameTypes.find((g) => g.id === selectedGameType)?.name} •{" "}
                      {themes.find((t) => t.id === selectedTheme)?.name}
                    </Typography>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕ Close
                  </Button>
                </div>

                <div className="p-6">
                  {/* Render actual game component based on selected type */}
                  {(() => {
                    const gameProps = {
                      questions: previewQuestions,
                      theme: selectedTheme,
                      onComplete: (score: number) => {
                        toast.success(
                          `Preview completed! Score: ${score}/${previewQuestions.length}`,
                        );
                      },
                    };

                    switch (selectedGameType) {
                      case "quiz":
                        return <Quiz {...gameProps} />;
                      case "truefalse":
                        return <TrueOrFalse {...gameProps} />;
                      case "matchup":
                        return <MatchUp {...gameProps} />;
                      case "findmatch":
                        return <FindTheMatch {...gameProps} />;
                      case "whackamole":
                        return <WhackAMole {...gameProps} />;
                      case "gameshow":
                        return <GameshowQuiz {...gameProps} />;
                      case "balloon":
                        return <BalloonPop {...gameProps} />;
                      case "maze":
                        return <MazeChase {...gameProps} />;
                      case "rankorder":
                        return <RankOrder {...gameProps} />;
                      case "airplane":
                        return <Airplane {...gameProps} />;
                      default:
                        return <Quiz {...gameProps} />;
                    }
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Not sticky anymore */}
          <div className="flex gap-3 py-4">
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <div className="flex-1" />

            <Button variant="outline" onClick={() => handleSubmit(true)}>
              Save Draft
            </Button>

            <Button onClick={() => handleSubmit(false)}>Publish</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
