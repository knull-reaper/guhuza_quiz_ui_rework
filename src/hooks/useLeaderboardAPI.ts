import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  username: string;
  level: number;
  totalScore: number;
  avgTime: number;
  totalTime: number;
  created_at: string;
}

interface UseLeaderboardAPIReturn {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export const useLeaderboardAPI = (): UseLeaderboardAPIReturn => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      // TODO: Replace with real backend call
      // const response = await fetch('/api/leaderboard');
      // const data = await response.json();
      
      // Mock implementation using localStorage
      const submissions = JSON.parse(localStorage.getItem('ghz_quizzes') || '[]');
      
      // Calculate best scores per user
      const userBest = new Map<string, LeaderboardEntry>();
      
      submissions.forEach((submission: any) => {
        const existing = userBest.get(submission.username);
        const current = {
          username: submission.username,
          level: submission.level,
          totalScore: submission.totalScore || submission.correctCount, // Backward compatibility
          avgTime: submission.avgTime || (submission.totalTime / 10), // Estimate if not available
          totalTime: submission.totalTime,
          created_at: submission.created_at
        };
        
        if (!existing || 
            current.totalScore > existing.totalScore || 
            (current.totalScore === existing.totalScore && current.avgTime < existing.avgTime) ||
            (current.totalScore === existing.totalScore && current.avgTime === existing.avgTime && current.totalTime < existing.totalTime)) {
          userBest.set(submission.username, current);
        }
      });
      
      // Sort by totalScore desc, then avgTime asc, then totalTime asc, take top 10
      const sortedEntries = Array.from(userBest.values())
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          if (a.avgTime !== b.avgTime) {
            return a.avgTime - b.avgTime;
          }
          return a.totalTime - b.totalTime;
        })
        .slice(0, 10);
      
      setEntries(sortedEntries);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leaderboard');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Poll every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return { entries, loading, error };
};