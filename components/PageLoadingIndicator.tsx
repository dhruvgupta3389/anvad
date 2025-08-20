"use client"

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PageLoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Reset loading state when pathname changes
    setIsLoading(false);
    setProgress(0);
  }, [pathname]);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElement = target.closest('a, button[data-href], img[data-href], h3[data-href], div[data-href]');
      
      if (clickableElement) {
        const href = clickableElement.getAttribute('href') || clickableElement.getAttribute('data-href');
        
        if (href && href.startsWith('/') && href !== pathname && !href.startsWith('#')) {
          setIsLoading(true);
          setProgress(0);
          
          // Simulate progress
          let currentProgress = 0;
          progressTimer = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress > 85) {
              currentProgress = 85;
              clearInterval(progressTimer);
            }
            setProgress(currentProgress);
          }, 50);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-[#F9F1E6]/50">
      <div 
        className="h-full bg-gradient-to-r from-[#7d3600] via-[#EDBC7E] to-[#7d3600] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default PageLoadingIndicator;
