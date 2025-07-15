import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Play, Trophy, Target, Zap, Award, Star, Shield } from 'lucide-react';
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

  // All possible badges for grid display
  const allBadges = [
    { id: 1, name: 'On the Board', description: 'Make it to the leaderboard', icon: Target },
    { id: 2, name: 'Streak Starter', description: 'Answer 5 questions correctly in a row', icon: Zap },
    { id: 3, name: 'Daily Returner', description: 'Play quizzes on consecutive days', icon: Star },
    { id: 4, name: 'Commentator', description: 'Provide feedback on questions', icon: Award },
    { id: 5, name: 'Cache Champion', description: 'Play when offline using cached questions', icon: Shield }
  ];

  const isBadgeEarned = (badgeId: number) => badges.some(b => b.id === badgeId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with gradient */}
        <Card className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl mb-1">Hello, {username}!</CardTitle>
                  <p className="text-primary-foreground/80 text-lg">
                    Ready for your next quiz adventure?
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={handleLogout} className="text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigate('/levels')} 
            className="h-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
          >
            <div className="text-center">
              <Target className="h-6 w-6 mx-auto mb-1" />
              <div className="text-sm font-medium">Choose Level</div>
            </div>
          </Button>
          <Button 
            onClick={() => navigate('/quiz/1')} 
            variant="outline"
            className="h-20 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200"
          >
            <div className="text-center">
              <Play className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <div className="text-sm font-medium text-green-700">Quick Start</div>
            </div>
          </Button>
          <Button 
            onClick={() => navigate('/leaderboard')} 
            variant="outline"
            className="h-20 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200"
          >
            <div className="text-center">
              <Trophy className="h-6 w-6 mx-auto mb-1 text-purple-600" />
              <div className="text-sm font-medium text-purple-700">Leaderboard</div>
            </div>
          </Button>
          <Button 
            onClick={() => navigate('/quiz/10')} 
            variant="outline"
            className="h-20 bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200"
          >
            <div className="text-center">
              <Zap className="h-6 w-6 mx-auto mb-1 text-red-600" />
              <div className="text-sm font-medium text-red-700">Challenge Mode</div>
            </div>
          </Button>
        </div>

        {/* Achievements Section */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            ) : achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-yellow-200"
                  >
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900">{achievement.name}</h4>
                      <p className="text-sm text-orange-700">{achievement.description}</p>
                    </div>
                    {achievement.awarded_at && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {new Date(achievement.awarded_at).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-orange-700 text-center py-4">
                Complete your first quiz to earn achievements!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Badges Grid */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Award className="h-5 w-5 text-indigo-600" />
              Badge Collection
            </CardTitle>
            <p className="text-purple-700 text-sm">
              Collect badges by completing special challenges
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBadges.map((badge) => {
                const earned = isBadgeEarned(badge.id);
                const earnedBadge = badges.find(b => b.id === badge.id);
                const Icon = badge.icon;
                
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      earned 
                        ? 'bg-white border-indigo-300 shadow-md hover:shadow-lg' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                        earned ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${earned ? 'text-indigo-600' : 'text-gray-400'}`} />
                      </div>
                      <h4 className={`font-semibold ${earned ? 'text-purple-900' : 'text-gray-500'}`}>
                        {badge.name}
                      </h4>
                      <p className={`text-xs ${earned ? 'text-purple-700' : 'text-gray-400'}`}>
                        {badge.description}
                      </p>
                      {earned && earnedBadge?.awarded_at && (
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-xs">
                          {new Date(earnedBadge.awarded_at).toLocaleDateString()}
                        </Badge>
                      )}
                      {!earned && (
                        <Badge variant="outline" className="text-gray-400 border-gray-300 text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};