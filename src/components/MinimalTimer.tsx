import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';

interface MinimalTimerProps {
  timeLeft: number;
  duration: number;
  isActive: boolean;
}

export const MinimalTimer: React.FC<MinimalTimerProps> = ({ timeLeft, duration, isActive }) => {
  const percentage = (timeLeft / duration) * 100;
  const isUrgent = percentage <= 25;
  
  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isUrgent ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Clock className={`h-5 w-5 ${
              isUrgent ? 'text-red-600' : 'text-blue-600'
            } ${isActive ? 'animate-pulse' : ''}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Time Remaining</span>
              <Badge variant={isUrgent ? "destructive" : "secondary"} className="text-xs">
                {timeLeft}s
              </Badge>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 rounded-full ${
                  isUrgent 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
              {isUrgent && (
                <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-full" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};