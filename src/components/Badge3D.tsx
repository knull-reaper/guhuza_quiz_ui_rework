import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, Award, Shield, Target, Zap } from 'lucide-react';

interface Badge3DProps {
  id: number;
  name: string;
  description: string;
  isEarned: boolean;
  awardedAt?: string;
  shape?: 'pentagon' | 'hexagon' | 'circle' | 'shield';
  color?: string;
}

const getBadgeIcon = (id: number) => {
  const icons = [Target, Zap, Star, Award, Shield];
  const IconComponent = icons[id - 1] || Star;
  return IconComponent;
};

const getBadgeColors = (id: number, isEarned: boolean) => {
  const colorSchemes = [
    {
      bg: isEarned ? 'from-blue-400 via-blue-500 to-blue-600' : 'from-gray-300 to-gray-400',
      border: isEarned ? 'from-blue-300 via-yellow-400 to-orange-400' : 'from-gray-400 to-gray-500',
      glow: isEarned ? 'shadow-blue-500/50' : 'shadow-gray-400/30'
    },
    {
      bg: isEarned ? 'from-yellow-400 via-orange-400 to-red-500' : 'from-gray-300 to-gray-400',
      border: isEarned ? 'from-yellow-300 via-orange-300 to-red-300' : 'from-gray-400 to-gray-500',
      glow: isEarned ? 'shadow-orange-500/50' : 'shadow-gray-400/30'
    },
    {
      bg: isEarned ? 'from-purple-400 via-purple-500 to-purple-600' : 'from-gray-300 to-gray-400',
      border: isEarned ? 'from-purple-300 via-pink-400 to-purple-400' : 'from-gray-400 to-gray-500',
      glow: isEarned ? 'shadow-purple-500/50' : 'shadow-gray-400/30'
    },
    {
      bg: isEarned ? 'from-green-400 via-emerald-500 to-green-600' : 'from-gray-300 to-gray-400',
      border: isEarned ? 'from-green-300 via-yellow-400 to-green-400' : 'from-gray-400 to-gray-500',
      glow: isEarned ? 'shadow-green-500/50' : 'shadow-gray-400/30'
    },
    {
      bg: isEarned ? 'from-red-400 via-red-500 to-red-600' : 'from-gray-300 to-gray-400',
      border: isEarned ? 'from-red-300 via-orange-400 to-red-400' : 'from-gray-400 to-gray-500',
      glow: isEarned ? 'shadow-red-500/50' : 'shadow-gray-400/30'
    }
  ];
  
  return colorSchemes[id - 1] || colorSchemes[0];
};

const getShapeClass = (shape: string = 'circle') => {
  switch (shape) {
    case 'pentagon':
      return 'badge-pentagon';
    case 'hexagon':
      return 'badge-hexagon';
    case 'shield':
      return 'badge-shield';
    default:
      return 'rounded-full';
  }
};

export const Badge3D: React.FC<Badge3DProps> = ({
  id,
  name,
  description,
  isEarned,
  awardedAt,
  shape = 'circle'
}) => {
  const IconComponent = getBadgeIcon(id);
  const colors = getBadgeColors(id, isEarned);
  const shapeClass = getShapeClass(shape);

  return (
    <div className="group relative">
      {/* Badge Container */}
      <div className={`
        relative w-24 h-24 mx-auto mb-3 transition-all duration-300 group-hover:scale-110
        ${isEarned ? 'badge-earned' : ''}
      `}>
        {/* Main Badge */}
        <div className={`
          w-full h-full bg-gradient-to-br ${colors.bg} ${shapeClass}
          shadow-xl ${colors.glow} relative overflow-hidden
          border-4 border-transparent bg-clip-padding
        `}>
          {/* Border Gradient Effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${colors.border} ${shapeClass}
            -z-10 transform scale-105
          `} />
          
          {/* Inner Glow */}
          <div className={`
            absolute inset-2 bg-gradient-to-br from-white/40 via-transparent to-transparent
            ${shapeClass} pointer-events-none
          `} />
          
          {/* Star Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`
              w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full
              flex items-center justify-center shadow-lg
              ${isEarned ? 'star-sparkle' : ''}
            `}>
              <Star className="h-5 w-5 text-yellow-900 fill-current" />
            </div>
          </div>
          
          {/* Badge Icon */}
          <div className="absolute top-1 right-1">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center
              ${isEarned ? 'bg-white/20' : 'bg-gray-600/20'}
            `}>
              <IconComponent className={`h-3 w-3 ${isEarned ? 'text-white' : 'text-gray-500'}`} />
            </div>
          </div>
          
          {/* Crown for Special Badges */}
          {id === 3 && isEarned && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Crown className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          )}
        </div>
        
        {/* Earned Indicator */}
        {isEarned && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <Star className="h-3 w-3 text-white fill-current" />
          </div>
        )}
      </div>
      
      {/* Badge Info */}
      <div className="text-center space-y-1">
        <h4 className={`font-bold text-sm ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
          {name}
        </h4>
        <p className={`text-xs ${isEarned ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
          {description}
        </p>
        
        {isEarned ? (
          awardedAt && (
            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
              {new Date(awardedAt).toLocaleDateString()}
            </Badge>
          )
        ) : (
          <Badge variant="outline" className="text-muted-foreground border-muted text-xs">
            Locked
          </Badge>
        )}
      </div>
    </div>
  );
};