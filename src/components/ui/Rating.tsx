import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  rating: number;
  max?: number;
  count?: number;
  showText?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  max = 5,
  count,
  showText = true,
}) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-400">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : i < rating
                ? 'fill-amber-200 text-amber-400'
                : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="text-slate-400 font-normal"> ({count})</span>
          )}
        </span>
      )}
    </div>
  );
};
