import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Lock, Play, Trophy } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">Choose Your Level</h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome, {username}</p>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground mb-2">
            Complete each level with 70% or higher to unlock the next one
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>70-79%</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>80-89%</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>90%+</span>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {levels.map((level) => (
            <Card 
              key={level.level} 
              className={`relative transition-all duration-200 ${
                level.unlocked 
                  ? 'hover:shadow-lg cursor-pointer border-primary/20' 
                  : 'opacity-60 bg-muted/30'
              }`}
              onClick={() => level.unlocked && navigate(`/quiz/${level.level}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  {level.unlocked ? (
                    <Play className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  Level {level.level}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                {/* Stars Display */}
                <div className="flex justify-center gap-1">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= level.stars
                          ? 'text-yellow-500 fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>

                {/* Score Display */}
                {level.bestScore !== undefined ? (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {level.bestScore}/10
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Best: {Math.round((level.bestScore / 10) * 100)}%
                    </div>
                  </div>
                ) : level.unlocked ? (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Not attempted</div>
                    <Button size="sm" className="w-full">
                      Start Level
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Requires 70% on Level {level.level - 1}
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                )}

                {/* Progress to unlock next level */}
                {level.unlocked && level.bestScore !== undefined && level.level < 10 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Progress to unlock Level {level.level + 1}
                    </div>
                    <Progress 
                      value={Math.min((level.bestScore / level.required) * 100, 100)} 
                      className="h-1" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Progress */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Overall Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {levels.filter(l => l.completed).length} of {levels.length} levels completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-bold">
                  {levels.reduce((sum, l) => sum + l.stars, 0)} Stars
                </span>
              </div>
            </div>
            <Progress 
              value={(levels.filter(l => l.completed).length / levels.length) * 100} 
              className="mt-3" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};