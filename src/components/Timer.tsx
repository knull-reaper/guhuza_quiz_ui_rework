import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // seconds
  onTimeUp: () => void;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isActive]);

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = percentage <= 25;

  return (
    <div className="flex items-center gap-3">
      <Clock className={`h-5 w-5 ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${isUrgent ? 'text-destructive' : 'text-foreground'}`}>
            {timeLeft}s
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              isUrgent ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};