import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, Trophy, Medal, Award, TrendingUp, Clock, Target } from 'lucide-react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useLeaderboardAPI } from '../hooks/useLeaderboardAPI';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { entries, loading, error } = useLeaderboardAPI();

  const topThreePlayers = entries.slice(0, 3);
  const otherPlayers = entries.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/profile')}
            className="border-2 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Top players ranked by performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Auto-refresh: 5s
            </div>
          </div>
        </div>

        {/* Ranking Criteria */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-center text-blue-900">Ranking System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-900">1st Priority</h3>
                <p className="text-sm text-blue-700">Highest Total Score</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900">2nd Priority</h3>
                <p className="text-sm text-purple-700">Fastest Average Time</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-900">3rd Priority</h3>
                <p className="text-sm text-green-700">Lowest Total Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading leaderboard...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-600 text-lg font-medium mb-2">Failed to load leaderboard</p>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : entries.length === 0 ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Scores Yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to complete a quiz and claim the top spot!</p>
              <Button onClick={() => navigate('/quiz/1')} className="bg-gradient-to-r from-primary to-accent">
                Start First Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Top 3 Podium */}
            {topThreePlayers.length > 0 && (
              <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-center text-orange-900 flex items-center justify-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    Top Champions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topThreePlayers.map((entry, index) => {
                      const rank = index + 1;
                      const icons = [
                        { icon: Trophy, color: 'from-yellow-400 to-yellow-500', bg: 'from-yellow-50 to-yellow-100' },
                        { icon: Medal, color: 'from-gray-400 to-gray-500', bg: 'from-gray-50 to-gray-100' },
                        { icon: Award, color: 'from-amber-600 to-orange-600', bg: 'from-amber-50 to-orange-100' }
                      ];
                      const { icon: Icon, color, bg } = icons[index];
                      
                      return (
                        <div key={entry.username} className={`text-center p-6 rounded-2xl bg-gradient-to-br ${bg} border-2 ${rank === 1 ? 'border-yellow-300' : rank === 2 ? 'border-gray-300' : 'border-amber-300'}`}>
                          <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-2xl font-bold mb-1">{entry.username}</div>
                          <Badge className={`mb-3 ${rank === 1 ? 'bg-yellow-100 text-yellow-800' : rank === 2 ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-amber-800'}`}>
                            #{rank}
                          </Badge>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Score:</span>
                              <span className="font-bold">{entry.totalScore}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Time:</span>
                              <span className="font-mono">{entry.avgTime?.toFixed(1) || 'N/A'}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Level:</span>
                              <span className="font-medium">{entry.level}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Remaining Players */}
            {otherPlayers.length > 0 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    All Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {otherPlayers.map((entry, index) => {
                      const rank = index + 4; // Starting from 4th place
                      return (
                        <div key={`${entry.username}-${index}`} className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-muted to-muted/80 rounded-xl font-bold text-muted-foreground">
                            {rank}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{entry.username}</div>
                            <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-bold text-primary text-lg">{entry.totalScore}/10</div>
                            <div className="text-xs text-muted-foreground">score</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-mono">{entry.avgTime?.toFixed(1) || 'N/A'}s</div>
                            <div className="text-xs text-muted-foreground">avg time</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-mono">{Math.floor(entry.totalTime / 60)}:{(entry.totalTime % 60).toString().padStart(2, '0')}</div>
                            <div className="text-xs text-muted-foreground">total time</div>
                          </div>
                          
                          <Badge variant="outline" className="text-xs">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => navigate('/levels')} 
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            Choose Your Level
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/quiz/1')}
            className="border-2"
          >
            Quick Start Level 1
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/profile')}
            className="border-2"
          >
            View Your Profile
          </Button>
        </div>
      </div>
    </div>
  );
};