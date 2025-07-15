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
      // TODO: Replace with real backend call
      const response = await fetch(`https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=${level}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }
      
      const data = await response.json();
      
      // TODO: Upsert data into localStorage cache
      localStorage.setItem(CACHE_KEY_PREFIX + level, JSON.stringify(data));
      
      setQuestions(data);
    } catch (err) {
      console.warn('API fetch failed, trying cache...', err);
      
      // TODO: Load from localStorage cache
      const cached = localStorage.getItem(CACHE_KEY_PREFIX + level);
      
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setQuestions(cachedData);
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