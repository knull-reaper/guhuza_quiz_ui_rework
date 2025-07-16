import { useState, useEffect } from "react";
import allQuestions from "../lib/quiz-questions.json";

export interface Question {
  id: number;
  question: string;
  answers: string[];
  correct: number;
  level: number;
}

interface UseQuizAPIReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useQuizAPI = (level: number): UseQuizAPIReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = () => {
    setLoading(true);
    setError(null);

    try {
      const levelQuestions = (allQuestions as Record<string, Question[]>)[
        level.toString()
      ];

      if (levelQuestions) {
        setQuestions(levelQuestions);
      } else {
        setError(`Level ${level} not found.`);
      }
    } catch (err) {
      setError("Failed to load quiz questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [level]);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
  };
};
