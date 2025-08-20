"use client"

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export type PageType = 'home' | 'products' | 'product' | 'cart' | 'other';

interface PageTransition {
  isLoading: boolean;
  pageType: PageType;
  progress: number;
}

export const usePageTransition = () => {
  const [transition, setTransition] = useState<PageTransition>({
    isLoading: false,
    pageType: 'other',
    progress: 0
  });
  
  const pathname = usePathname();

  const getPageType = (path: string): PageType => {
    if (path === '/') return 'home';
    if (path.startsWith('/products/')) return 'products';
    if (path.startsWith('/product/')) return 'product';
    if (path === '/cart') return 'cart';
    return 'other';
  };

  const startTransition = (targetPath: string) => {
    const pageType = getPageType(targetPath);
    setTransition({ isLoading: true, pageType, progress: 0 });
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) {
        progress = 90;
        clearInterval(interval);
      }
      setTransition(prev => ({ ...prev, progress }));
    }, 100);
    
    return () => clearInterval(interval);
  };

  const completeTransition = () => {
    setTransition(prev => ({ ...prev, progress: 100 }));
    setTimeout(() => {
      setTransition(prev => ({ ...prev, isLoading: false, progress: 0 }));
    }, 200);
  };

  useEffect(() => {
    completeTransition();
  }, [pathname]);

  return {
    ...transition,
    startTransition,
    completeTransition
  };
};

// Enhanced loading skeleton with brand colors
export const BrandLoadingSkeleton = ({ 
  className, 
  variant = 'default' 
}: { 
  className?: string; 
  variant?: 'default' | 'primary' | 'secondary';
}) => {
  const variants = {
    default: 'from-gray-200 via-gray-100 to-gray-200',
    primary: 'from-[#7d3600]/20 via-[#EDBC7E]/20 to-[#7d3600]/20',
    secondary: 'from-[#EDBC7E]/30 via-[#F9F1E6]/30 to-[#EDBC7E]/30'
  };

  return (
    <div className={`bg-gradient-to-r ${variants[variant]} rounded animate-pulse relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-40"></div>
    </div>
  );
};
