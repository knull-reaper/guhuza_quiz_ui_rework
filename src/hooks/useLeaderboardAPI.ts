import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  username: string;
  level: number;
  correctCount: number;
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
          correctCount: submission.correctCount,
          totalTime: submission.totalTime,
          created_at: submission.created_at
        };
        
        if (!existing || 
            current.correctCount > existing.correctCount || 
            (current.correctCount === existing.correctCount && current.totalTime < existing.totalTime)) {
          userBest.set(submission.username, current);
        }
      });
      
      // Sort by correctCount desc, then totalTime asc, take top 10
      const sortedEntries = Array.from(userBest.values())
        .sort((a, b) => {
          if (b.correctCount !== a.correctCount) {
            return b.correctCount - a.correctCount;
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