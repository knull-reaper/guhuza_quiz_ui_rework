import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '../hooks/useLeaderboardAPI';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
  error?: string | null;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-bold">{rank}</span>;
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Top Players
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-muted-foreground">No scores yet. Be the first to complete a quiz!</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={`${entry.username}-${index}`}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  index < 3 ? 'bg-muted/50' : ''
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index + 1)}
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold">{entry.username}</div>
                  <div className="text-sm text-muted-foreground">
                    Level {entry.level}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-primary">
                    {entry.correctCount}/10
                  </div>
                  <div className="text-xs text-muted-foreground">
                    correct
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-mono text-sm">
                    {formatTime(entry.totalTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    time
                  </div>
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {new Date(entry.created_at).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};