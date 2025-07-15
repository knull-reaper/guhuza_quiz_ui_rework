import { useState, useEffect } from 'react';

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

const CACHE_KEY_PREFIX = 'ghz_quiz_cache_level_';

// Mock questions as fallback
const generateMockQuestions = (level: number): Question[] => {
  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const difficulty = difficulties[Math.min(level - 1, 3)] || 'expert';
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `Level ${level} ${difficulty} question ${i + 1}: What is the capital of a fictional country?`,
    answers: [
      'Answer A',
      'Answer B', 
      'Answer C',
      'Answer D'
    ],
    correct: Math.floor(Math.random() * 4),
    level: level
  }));
};

export const useQuizAPI = (level: number): UseQuizAPIReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v2/quiz?level=${level}`);

      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }

      const apiJson = await response.json();

      let questions: any[] = [];
      if (Array.isArray(apiJson)) {
        questions = apiJson;
      } else if (Array.isArray(apiJson.questions)) {
        questions = apiJson.questions;
      } else if (Array.isArray(apiJson.test?.question)) {
        questions = apiJson.test.question;
      }

      const data: Question[] = questions.map((q: any, idx: number) => ({
        id: q.id ?? idx + 1,
        question: q.question,
        answers: q.answers,
        correct: q.test_answer ?? q.correct,
        level: q.level ?? level
      }));

      // Cache the fetched questions so we can work offline later
      localStorage.setItem(
        CACHE_KEY_PREFIX + level,
        JSON.stringify({ ts: Date.now(), data })
      );

      setQuestions(data);
    } catch (err) {
      console.warn('API fetch failed, trying cache...', err);

      const cached = localStorage.getItem(CACHE_KEY_PREFIX + level);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setQuestions(parsed.data ?? parsed);
        } catch {
          // If cache is corrupted, use mock data
          setQuestions(generateMockQuestions(level));
        }
      } else {
        // No cache available, use mock data
        setQuestions(generateMockQuestions(level));
      }
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
    refetch: fetchQuestions
  };
};