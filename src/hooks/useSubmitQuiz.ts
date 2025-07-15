import { useState } from 'react';
import { useUser } from '../context/UserContext';

export interface QuizResult {
  level: number;
  totalScore: number;
  totalTime: number;
  avgTime: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  awarded_at?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  awarded_at?: string;
}

interface SubmitResponse {
  success: boolean;
  newlyAwarded: {
    achievements: Achievement[];
    badges: Badge[];
  };
  updatedLevels?: any[]; // For future backend integration
}

export const useSubmitQuiz = () => {
  const [submitting, setSubmitting] = useState(false);
  const { username } = useUser();

  const submitQuiz = async (result: QuizResult): Promise<SubmitResponse> => {
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result, username })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data: SubmitResponse = await response.json();

      // Persist the submission locally so the rest of the app can work offline
      const submissions = JSON.parse(localStorage.getItem('ghz_quizzes') || '[]');
      submissions.push({
        id: Date.now(),
        username,
        level: result.level,
        correctCount: result.totalScore,
        totalScore: result.totalScore,
        totalTime: result.totalTime,
        avgTime: result.avgTime,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('ghz_quizzes', JSON.stringify(submissions));

      return data;
    } catch (error) {
      // Fallback to local submission when the backend is unreachable
      console.warn('submitQuiz falling back to local storage:', error);

      const submissions = JSON.parse(localStorage.getItem('ghz_quizzes') || '[]');
      const newSubmission = {
        id: Date.now(),
        username,
        level: result.level,
        correctCount: result.totalScore,
        totalScore: result.totalScore,
        totalTime: result.totalTime,
        avgTime: result.avgTime,
        created_at: new Date().toISOString()
      };

      submissions.push(newSubmission);
      localStorage.setItem('ghz_quizzes', JSON.stringify(submissions));

      const mockAwards = calculateMockAwards(submissions.filter((s: any) => s.username === username));

      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        newlyAwarded: mockAwards
      };
    } finally {
      setSubmitting(false);
    }
  };

  return { submitQuiz, submitting };
};

// Mock achievement calculation
const calculateMockAwards = (userSubmissions: any[]): { achievements: Achievement[]; badges: Badge[] } => {
  const awarded = { achievements: [] as Achievement[], badges: [] as Badge[] };
  
  // Check for achievements
  if (userSubmissions.length === 1) {
    awarded.achievements.push({
      id: 1,
      name: 'Quiz Novice',
      description: 'Complete your first quiz',
      awarded_at: new Date().toISOString()
    });
  }
  
  if (userSubmissions.length === 10) {
    awarded.achievements.push({
      id: 2,
      name: 'Quiz Enthusiast', 
      description: 'Complete 10 quizzes',
      awarded_at: new Date().toISOString()
    });
  }
  
  const latestQuiz = userSubmissions[userSubmissions.length - 1];
  if (latestQuiz.correctCount === 10) {
    awarded.achievements.push({
      id: 3,
      name: 'Flawless Victory',
      description: 'Answer all questions correctly in a quiz',
      awarded_at: new Date().toISOString()
    });
  }
  
  if (latestQuiz.level === 10) {
    awarded.achievements.push({
      id: 5,
      name: 'Level Conqueror',
      description: 'Complete level 10',
      awarded_at: new Date().toISOString()
    });
  }
  
  return awarded;
};