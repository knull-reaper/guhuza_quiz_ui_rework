import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogOut, Play } from 'lucide-react';
import { AchievementList } from '../components/AchievementList';
import { useAchievementAPI } from '../hooks/useAchievementAPI';
import { useUser } from '../context/UserContext';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { username, logout } = useUser();
  const { achievements, badges, loading } = useAchievementAPI();

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  if (!username) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">{username}</CardTitle>
                  <p className="text-muted-foreground">Quiz Master Profile</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Button onClick={() => navigate('/quiz/1')} className="h-16">
            <Play className="h-5 w-5 mr-2" />
            Start Quiz
          </Button>
          <Button variant="outline" onClick={() => navigate('/leaderboard')} className="h-16">
            View Leaderboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/quiz/10')} className="h-16">
            Challenge Mode
          </Button>
        </div>

        {/* Achievements & Badges */}
        <AchievementList 
          achievements={achievements}
          badges={badges}
          loading={loading}
        />
      </div>
    </div>
  );
};