import { useState } from 'react';
import { useUser } from '../context/UserContext';

export interface QuizResult {
  level: number;
  correctCount: number;
  totalTime: number;
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
  awarded: {
    achievements: Achievement[];
    badges: Badge[];
  };
}

export const useSubmitQuiz = () => {
  const [submitting, setSubmitting] = useState(false);
  const { username } = useUser();

  const submitQuiz = async (result: QuizResult): Promise<SubmitResponse> => {
    setSubmitting(true);
    
    try {
      // TODO: Replace with real backend call
      // const response = await fetch('/api/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...result, username })
      // });
      
      // Mock submission - store in localStorage
      const submissions = JSON.parse(localStorage.getItem('ghz_quizzes') || '[]');
      const newSubmission = {
        id: Date.now(),
        username,
        ...result,
        created_at: new Date().toISOString()
      };
      
      submissions.push(newSubmission);
      localStorage.setItem('ghz_quizzes', JSON.stringify(submissions));
      
      // Mock achievement/badge calculation
      const mockAwards = calculateMockAwards(submissions.filter((s: any) => s.username === username));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        awarded: mockAwards
      };
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      return {
        success: false,
        awarded: { achievements: [], badges: [] }
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