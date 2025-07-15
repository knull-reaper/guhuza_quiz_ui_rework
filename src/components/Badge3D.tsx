import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Crown } from 'lucide-react';

// Import badge assets
import badgeBronze from '../assets/badge-bronze.png';
import badgeSilver from '../assets/badge-silver.png';
import badgeGold from '../assets/badge-gold.png';
import badgePlatinum from '../assets/badge-platinum.png';
import badgeDiamond from '../assets/badge-diamond.png';
import badgeLegendary from '../assets/badge-legendary.png';

interface Badge3DProps {
  id: number;
  name: string;
  description: string;
  isEarned: boolean;
  awardedAt?: string;
  shape?: 'pentagon' | 'hexagon' | 'circle' | 'shield';
  color?: string;
}

const getBadgeAsset = (id: number) => {
  const badges = [
    badgeBronze,    // Bronze - Basic achievement
    badgeSilver,    // Silver - Intermediate achievement  
    badgeGold,      // Gold - Advanced achievement
    badgePlatinum,  // Platinum - Expert achievement
    badgeDiamond,   // Diamond - Master achievement
    badgeLegendary  // Legendary - Ultimate achievement
  ];
  
  return badges[(id - 1) % badges.length] || badgeBronze;
};

export const Badge3D: React.FC<Badge3DProps> = ({
  id,
  name,
  description,
  isEarned,
  awardedAt
}) => {
  const badgeAsset = getBadgeAsset(id);

  return (
    <div className="group relative">
      {/* Badge Container */}
      <div className={`
        relative w-24 h-24 mx-auto mb-3 transition-all duration-300 group-hover:scale-110
        ${isEarned ? 'badge-earned' : ''}
      `}>
        {/* Main Badge Image */}
        <div className="relative w-full h-full">
          <img 
            src={badgeAsset} 
            alt={name}
            className={`
              w-full h-full object-contain transition-all duration-300
              ${!isEarned ? 'filter grayscale brightness-50' : 'filter drop-shadow-lg'}
              ${isEarned ? 'group-hover:filter group-hover:brightness-110 group-hover:drop-shadow-2xl' : ''}
            `}
          />
          
          {/* Crown for Special Badges */}
          {id === 3 && isEarned && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Crown className="h-4 w-4 text-yellow-400 fill-current drop-shadow-md" />
            </div>
          )}
        </div>
        
        {/* Earned Indicator */}
        {isEarned && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
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