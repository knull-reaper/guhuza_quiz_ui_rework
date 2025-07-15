import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useLeaderboardAPI } from '../hooks/useLeaderboardAPI';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { entries, loading, error } = useLeaderboardAPI();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <div className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm text-muted-foreground">Auto-refresh: 5s</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Top players ranked by highest score, then fastest completion time
          </p>
        </div>

        {/* Leaderboard */}
        <LeaderboardTable 
          entries={entries} 
          loading={loading} 
          error={error} 
        />

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={() => navigate('/quiz/1')}>
            Start New Quiz
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};