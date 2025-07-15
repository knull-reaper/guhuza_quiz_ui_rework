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
      let data: LeaderboardEntry[] | null = null;

      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Server returned an error');
        }
        data = await response.json();
      } catch (err) {
        // Fallback to calculating from local submissions
        const submissions = JSON.parse(
          localStorage.getItem('ghz_quizzes') || '[]'
        );

        // Calculate best scores per user
        const userBest = new Map<string, LeaderboardEntry>();

        submissions.forEach((submission: any) => {
          const existing = userBest.get(submission.username);
          const current = {
            username: submission.username,
            level: submission.level,
            totalScore:
              submission.totalScore || submission.correctCount,
            avgTime:
              submission.avgTime || submission.totalTime / 10,
            totalTime: submission.totalTime,
            created_at: submission.created_at,
          } as LeaderboardEntry;

          if (
            !existing ||
            current.totalScore > existing.totalScore ||
            (current.totalScore === existing.totalScore &&
              current.avgTime < existing.avgTime) ||
            (current.totalScore === existing.totalScore &&
              current.avgTime === existing.avgTime &&
              current.totalTime < existing.totalTime)
          ) {
            userBest.set(submission.username, current);
          }
        });

        data = Array.from(userBest.values())
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
      }

      setEntries(data ?? []);
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