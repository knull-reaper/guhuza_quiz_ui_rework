import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Clock, Target, Crown } from 'lucide-react';
import { Achievement, Badge as BadgeType } from '../hooks/useSubmitQuiz';

interface AchievementListProps {
  achievements: Achievement[];
  badges: BadgeType[];
  loading?: boolean;
}

const getAchievementIcon = (name: string) => {
  switch (name) {
    case 'Quiz Novice':
      return <Target className="h-5 w-5" />;
    case 'Quiz Enthusiast': 
      return <Trophy className="h-5 w-5" />;
    case 'Flawless Victory':
      return <Crown className="h-5 w-5" />;
    case 'Speed Demon':
      return <Clock className="h-5 w-5" />;
    case 'Level Conqueror':
      return <Award className="h-5 w-5" />;
    default:
      return <Trophy className="h-5 w-5" />;
  }
};

const getBadgeIcon = (name: string) => {
  switch (name) {
    case 'On the Board':
      return <Trophy className="h-4 w-4" />;
    case 'Streak Starter':
      return <Target className="h-4 w-4" />;
    case 'Daily Returner':
      return <Clock className="h-4 w-4" />;
    case 'Commentator':
      return <Award className="h-4 w-4" />;
    case 'Cache Champion':
      return <Crown className="h-4 w-4" />;
    default:
      return <Award className="h-4 w-4" />;
  }
};

export const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  badges,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading achievements...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Achievements ({achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <p className="text-muted-foreground">No achievements earned yet. Complete some quizzes to start earning achievements!</p>
          ) : (
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="text-primary mt-1">
                    {getAchievementIcon(achievement.name)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    {achievement.awarded_at && (
                      <p className="text-xs text-muted-foreground">
                        Earned on {new Date(achievement.awarded_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-accent" />
            Badges ({badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-muted-foreground">No badges earned yet. Keep playing to unlock special badges!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge.id} variant="secondary" className="flex items-center gap-1 p-2">
                  {getBadgeIcon(badge.name)}
                  <span>{badge.name}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};