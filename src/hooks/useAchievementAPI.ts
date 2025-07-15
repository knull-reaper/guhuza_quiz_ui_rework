import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Achievement, Badge } from './useSubmitQuiz';

interface UseAchievementAPIReturn {
  achievements: Achievement[];
  badges: Badge[];
  loading: boolean;
  error: string | null;
}

// Predefined achievements and badges
const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 1, name: 'Quiz Novice', description: 'Complete your first quiz' },
  { id: 2, name: 'Quiz Enthusiast', description: 'Complete 10 quizzes' },
  { id: 3, name: 'Flawless Victory', description: 'Answer all questions correctly in a quiz' },
  { id: 4, name: 'Speed Demon', description: 'Average ≤ 5 seconds per question over 10 quizzes' },
  { id: 5, name: 'Level Conqueror', description: 'Complete level 10' }
];

const ALL_BADGES: Badge[] = [
  { id: 1, name: 'On the Board', description: 'Make it to the leaderboard' },
  { id: 2, name: 'Streak Starter', description: 'Answer 5 questions correctly in a row' },
  { id: 3, name: 'Daily Returner', description: 'Play quizzes on consecutive days' },
  { id: 4, name: 'Commentator', description: 'Provide feedback on questions' },
  { id: 5, name: 'Cache Champion', description: 'Play when offline using cached questions' }
];

export const useAchievementAPI = (): UseAchievementAPIReturn => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useUser();

  const fetchUserAchievements = async () => {
    if (!username) {
      setAchievements([]);
      setBadges([]);
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with real backend call
      // const response = await fetch(`/api/user/${username}/achievements`);
      // const data = await response.json();
      
      // Mock implementation using localStorage
      const submissions = JSON.parse(localStorage.getItem('ghz_quizzes') || '[]');
      const userSubmissions = submissions.filter((s: any) => s.username === username);
      
      const earnedAchievements = calculateUserAchievements(userSubmissions);
      const earnedBadges = calculateUserBadges(userSubmissions);
      
      setAchievements(earnedAchievements);
      setBadges(earnedBadges);
      setError(null);
    } catch (err) {
      setError('Failed to fetch achievements');
      console.error('Achievement fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAchievements();
  }, [username]);

  return { achievements, badges, loading, error };
};

// Calculate which achievements user has earned
const calculateUserAchievements = (userSubmissions: any[]): Achievement[] => {
  const earned: Achievement[] = [];
  
  // Quiz Novice - complete first quiz
  if (userSubmissions.length >= 1) {
    earned.push({
      ...ALL_ACHIEVEMENTS[0],
      awarded_at: userSubmissions[0].created_at
    });
  }
  
  // Quiz Enthusiast - complete 10 quizzes
  if (userSubmissions.length >= 10) {
    earned.push({
      ...ALL_ACHIEVEMENTS[1],
      awarded_at: userSubmissions[9].created_at
    });
  }
  
  // Flawless Victory - all correct in any quiz
  const flawlessQuiz = userSubmissions.find(s => s.correctCount === 10);
  if (flawlessQuiz) {
    earned.push({
      ...ALL_ACHIEVEMENTS[2],
      awarded_at: flawlessQuiz.created_at
    });
  }
  
  // Speed Demon - average ≤ 5 sec per question over 10 quizzes
  if (userSubmissions.length >= 10) {
    const avgTimePerQuestion = userSubmissions.slice(-10).reduce((sum, s) => sum + s.totalTime, 0) / (10 * 10);
    if (avgTimePerQuestion <= 5) {
      earned.push({
        ...ALL_ACHIEVEMENTS[3],
        awarded_at: userSubmissions[userSubmissions.length - 1].created_at
      });
    }
  }
  
  // Level Conqueror - complete level 10
  const level10Quiz = userSubmissions.find(s => s.level === 10);
  if (level10Quiz) {
    earned.push({
      ...ALL_ACHIEVEMENTS[4],
      awarded_at: level10Quiz.created_at
    });
  }
  
  return earned;
};

// Calculate which badges user has earned
const calculateUserBadges = (userSubmissions: any[]): Badge[] => {
  const earned: Badge[] = [];
  
  // Mock badge calculation - for now just award some random badges
  if (userSubmissions.length >= 1) {
    earned.push({
      ...ALL_BADGES[0],
      awarded_at: userSubmissions[0].created_at
    });
  }
  
  if (userSubmissions.length >= 3) {
    earned.push({
      ...ALL_BADGES[1],
      awarded_at: userSubmissions[2].created_at
    });
  }
  
  return earned;
};