import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

export interface LevelStatus {
  level: number;
  unlocked: boolean;
  stars: number; // 0-3 stars earned
  bestScore?: number;
  required: number; // required score to unlock next level (70%)
  completed: boolean;
}

interface UseLevelsAPIReturn {
  levels: LevelStatus[];
  loading: boolean;
  error: string | null;
}

export const useLevelsAPI = (): UseLevelsAPIReturn => {
  const [levels, setLevels] = useState<LevelStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useUser();

  const fetchLevels = async () => {
    if (!username) {
      setLevels([]);
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with real backend call
      // const response = await fetch(`/api/user/${username}/levels`);
      // const data = await response.json();
      
      // Mock implementation using localStorage
      const submissions = JSON.parse(localStorage.getItem('ghz_quizzes') || '[]');
      const userSubmissions = submissions.filter((s: any) => s.username === username);
      
      const levelStatuses = calculateLevelStatuses(userSubmissions);
      
      setLevels(levelStatuses);
      setError(null);
    } catch (err) {
      setError('Failed to fetch level data');
      console.error('Levels fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, [username]);

  return { levels, loading, error };
};

// Calculate level unlock status and stars earned
const calculateLevelStatuses = (userSubmissions: any[]): LevelStatus[] => {
  const levels: LevelStatus[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const levelSubmissions = userSubmissions.filter(s => s.level === i);
    const bestSubmission = levelSubmissions.reduce((best, current) => {
      if (!best) return current;
      if (current.correctCount > best.correctCount) return current;
      if (current.correctCount === best.correctCount && current.totalTime < best.totalTime) return current;
      return best;
    }, null);
    
    const bestScore = bestSubmission ? bestSubmission.correctCount : 0;
    const scorePercentage = (bestScore / 10) * 100;
    
    // Calculate stars based on percentage
    let stars = 0;
    if (scorePercentage >= 90) stars = 3;
    else if (scorePercentage >= 80) stars = 2;
    else if (scorePercentage >= 70) stars = 1;
    
    // Level 1 is always unlocked, others require 70% on previous level
    let unlocked = i === 1;
    if (i > 1) {
      const prevLevel = levels[i - 2];
      unlocked = prevLevel && prevLevel.bestScore !== undefined && (prevLevel.bestScore / 10) * 100 >= 70;
    }
    
    levels.push({
      level: i,
      unlocked,
      stars,
      bestScore: bestSubmission ? bestScore : undefined,
      required: 7, // 70% (7 out of 10)
      completed: bestSubmission !== null
    });
  }
  
  return levels;
};