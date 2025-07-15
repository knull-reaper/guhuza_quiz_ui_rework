import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Play, Trophy, Target, Zap, Award, BarChart, Medal } from 'lucide-react';
import { Badge3D } from '../components/Badge3D';
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

  // All possible badges for grid display with different shapes
  const allBadges = [
    { id: 1, name: 'On the Board', description: 'Make it to the leaderboard', shape: 'hexagon' as const },
    { id: 2, name: 'Streak Starter', description: 'Answer 5 questions correctly in a row', shape: 'pentagon' as const },
    { id: 3, name: 'Daily Returner', description: 'Play quizzes on consecutive days', shape: 'shield' as const },
    { id: 4, name: 'Commentator', description: 'Provide feedback on questions', shape: 'circle' as const },
    { id: 5, name: 'Cache Champion', description: 'Play when offline using cached questions', shape: 'hexagon' as const }
  ];

  const isBadgeEarned = (badgeId: number) => badges.some(b => b.id === badgeId);

  const getStatsFromSubmissions = () => {
    const submissions = JSON.parse(localStorage.getItem('ghz_quizzes') || '[]');
    const userSubmissions = submissions.filter((s: any) => s.username === username);
    
    const totalQuizzes = userSubmissions.length;
    const totalScore = userSubmissions.reduce((sum: number, s: any) => sum + (s.totalScore || s.correctCount || 0), 0);
    const avgScore = totalQuizzes > 0 ? (totalScore / totalQuizzes).toFixed(1) : '0';
    const bestScore = userSubmissions.reduce((best: number, s: any) => Math.max(best, s.totalScore || s.correctCount || 0), 0);
    
    return { totalQuizzes, avgScore, bestScore };
  };

  const { totalQuizzes, avgScore, bestScore } = getStatsFromSubmissions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-primary to-accent text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <CardTitle className="text-4xl font-bold mb-2">Hello, {username}!</CardTitle>
                  <p className="text-white/90 text-lg font-medium">
                    Ready to challenge your knowledge today?
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm font-medium">
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                      <BarChart className="h-4 w-4" />
                      {totalQuizzes} Quizzes
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                      <Trophy className="h-4 w-4" />
                      {avgScore} Avg Score
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                      <Medal className="h-4 w-4" />
                      {bestScore}/10 Best
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={handleLogout} 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/levels')} 
            className="h-auto p-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md rounded-lg"
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-blue-900 mb-1">Choose Level</h3>
                <p className="text-sm text-blue-700">Pick your challenge</p>
              </CardContent>
            </Card>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/quiz/1')} 
            className="h-auto p-0 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md rounded-lg"
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-green-900 mb-1">Quick Start</h3>
                <p className="text-sm text-green-700">Jump right in</p>
              </CardContent>
            </Card>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/leaderboard')} 
            className="h-auto p-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md rounded-lg"
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-purple-900 mb-1">Leaderboard</h3>
                <p className="text-sm text-purple-700">See top players</p>
              </CardContent>
            </Card>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/quiz/10')} 
            className="h-auto p-0 bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md rounded-lg"
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-red-900 mb-1">Challenge Mode</h3>
                <p className="text-sm text-red-700">Ultimate test</p>
              </CardContent>
            </Card>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-orange-900">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                Your Achievements
              </CardTitle>
              <p className="text-orange-700 text-sm">
                Unlock achievements by completing challenges
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
              ) : achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-400 hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-orange-900 text-lg">{achievement.name}</h4>
                        <p className="text-orange-700">{achievement.description}</p>
                      </div>
                      {achievement.awarded_at && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          {new Date(achievement.awarded_at).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">
                    Complete your first quiz to earn achievements!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges Collection */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-purple-900">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Badge Collection
              </CardTitle>
              <p className="text-purple-700 text-sm">
                {badges.length} of {allBadges.length} badges earned
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {allBadges.map((badge) => {
                  const earned = isBadgeEarned(badge.id);
                  const earnedBadge = badges.find(b => b.id === badge.id);
                  
                  return (
                    <Badge3D
                      key={badge.id}
                      id={badge.id}
                      name={badge.name}
                      description={badge.description}
                      isEarned={earned}
                      awardedAt={earnedBadge?.awarded_at}
                      shape={badge.shape}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};