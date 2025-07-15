import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  useEffect(() => {
    if (trigger) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          onComplete?.();
        }
      }());
    }
  }, [trigger, onComplete]);

  return null;
};

interface FlyingStarsProps {
  isActive: boolean;
  count?: number;
}

export const FlyingStars: React.FC<FlyingStarsProps> = ({ isActive, count = 5 }) => {
  const [stars, setStars] = useState<Array<{ id: number; delay: number; left: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newStars = Array.from({ length: count }, (_, i) => ({
        id: i,
        delay: i * 200,
        left: Math.random() * 80 + 10 // Random position between 10% and 90%
      }));
      setStars(newStars);
    } else {
      setStars([]);
    }
  }, [isActive, count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bottom-0 star-flying"
          style={{
            left: `${star.left}%`,
            animationDelay: `${star.delay}ms`,
            fontSize: '24px'
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
};