import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DiscountBadgeProps {
  discountPercentage: number;
  className?: string;
  variant?: 'simple' | 'curved' | 'modern' | 'tab';
}

const DiscountBadge = ({ 
  discountPercentage, 
  className = '', 
  variant = 'simple' 
}: DiscountBadgeProps) => {
  if (discountPercentage <= 0) return null;

  if (variant === 'simple') {
    return (
      <Badge 
        className={`bg-red-500 hover:bg-red-600 text-white font-semibold ${className}`}
      >
        {discountPercentage}% OFF
      </Badge>
    );
  }

  if (variant === 'modern') {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold shadow-md ${className}`}>
        -{discountPercentage}%
      </div>
    );
  }

  // Tab variant (based on provided CSS)
  if (variant === 'tab') {
    return (
      <div className={`absolute top-0 left-4 w-9 h-9 bg-[#e53300] rounded-b-lg flex flex-col items-center justify-center z-[2] text-white text-xs font-bold before:content-[''] before:absolute before:top-0 before:left-0.5 before:w-[calc(100%-4px)] before:h-[calc(100%-2px)] before:border-b before:border-l before:border-r before:border-[#ffebbc] before:rounded-b-[7px] before:pointer-events-none ${className}`}>
        {discountPercentage}%
      </div>
    );
  }

  // Curved variant (existing 3D style)
  if (variant === 'curved') {
    return (
      <div className={`relative inline-block perspective-800 ${className}`}>
        <div className="bg-[#7d3600] text-white font-semibold px-3 py-1.5 rounded-tr-lg rounded-br-lg rounded-bl-lg shadow-xl transform rotate-x-3">
          {discountPercentage}% OFF
        </div>
        <div className="absolute top-0 left-0 w-3 h-full bg-[#5a2a00] rounded-bl-lg transform -translate-x-1 rotate-y-12 filter brightness-90"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[#4a2300] rounded-br-lg transform translate-y-1 skew-x-12"></div>
        <div className="absolute inset-0 rounded-tr-lg rounded-br-lg rounded-bl-lg pointer-events-none bg-white/10"></div>
      </div>
    );
  }

  return null;
};

export default DiscountBadge;
