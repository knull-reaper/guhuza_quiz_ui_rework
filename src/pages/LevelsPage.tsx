import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Lock, Play, Trophy, CheckCircle, Target } from 'lucide-react';
import { useLevelsAPI } from '../hooks/useLevelsAPI';
import { useUser } from '../context/UserContext';

export const LevelsPage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useUser();
  const { levels, loading, error } = useLevelsAPI();

  if (!username) {
    navigate('/signup');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-muted/40">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading your levels...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedLevels = levels.filter(l => l.completed).length;
  const totalStars = levels.reduce((sum, l) => sum + l.stars, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
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
              Choose Your Challenge
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Progress through levels and unlock new challenges
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-semibold text-foreground">{username}</p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary">{completedLevels}</div>
                <div className="text-sm text-muted-foreground">Levels Completed</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <Star className="h-8 w-8 text-white fill-current" />
                </div>
                <div className="text-3xl font-bold text-yellow-600">{totalStars}</div>
                <div className="text-sm text-muted-foreground">Stars Earned</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-600">{Math.round((completedLevels / levels.length) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{completedLevels} of {levels.length}</span>
              </div>
              <Progress value={(completedLevels / levels.length) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Star Rating Legend */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-6 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">70-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">80-89%</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">90%+</span>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {levels.map((level) => {
            const isUnlocked = level.unlocked;
            const hasScore = level.bestScore !== undefined;
            const scorePercentage = hasScore ? Math.round((level.bestScore! / 10) * 100) : 0;
            
            return (
              <Card 
                key={level.level} 
                className={`group relative overflow-hidden border-0 shadow-lg transition-all duration-300 ${
                  isUnlocked 
                    ? 'hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-white' 
                    : 'opacity-60 bg-gray-50'
                }`}
                onClick={() => isUnlocked && navigate(`/quiz/${level.level}`)}
              >
                {/* Background Gradient */}
                {isUnlocked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <CardHeader className="pb-3 relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      {isUnlocked ? (
                        hasScore ? (
                          <CheckCircle className="h-6 w-6 text-success" />
                        ) : (
                          <Play className="h-6 w-6 text-primary" />
                        )
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                      Level {level.level}
                    </CardTitle>
                    {level.level === 10 && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 relative">
                  {/* Stars Display */}
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 transition-colors ${
                          star <= level.stars
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Score or Status */}
                  {hasScore ? (
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {level.bestScore}/10
                      </div>
                      <div className="text-sm font-medium text-success">
                        Best: {scorePercentage}%
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        Replay Level
                      </Button>
                    </div>
                  ) : isUnlocked ? (
                    <div className="text-center space-y-3">
                      <div className="text-muted-foreground">Ready to start</div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      >
                        Start Level
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Complete Level {level.level - 1} with 70%
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Progress needed</div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  )}

                  {/* Progress indicator for next level */}
                  {isUnlocked && hasScore && level.level < 10 && (
                    <div className="border-t pt-3 space-y-2">
                      <div className="text-xs text-muted-foreground text-center">
                        Next level: {Math.min((level.bestScore! / level.required) * 100, 100).toFixed(0)}% unlocked
                      </div>
                      <Progress 
                        value={Math.min((level.bestScore! / level.required) * 100, 100)} 
                        className="h-1" 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};