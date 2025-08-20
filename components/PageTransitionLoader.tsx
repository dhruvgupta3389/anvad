"use client"

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingState {
  isLoading: boolean;
  pageType: 'home' | 'products' | 'product' | 'cart' | 'other';
}

const PageTransitionLoader = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({ 
    isLoading: false, 
    pageType: 'other' 
  });
  const pathname = usePathname();

  const getPageType = (path: string): LoadingState['pageType'] => {
    if (path === '/') return 'home';
    if (path.startsWith('/products/')) return 'products';
    if (path.startsWith('/product/')) return 'product';
    if (path === '/cart') return 'cart';
    return 'other';
  };

  useEffect(() => {
    // Hide loader when pathname changes (page has loaded)
    setLoadingState(prev => ({ ...prev, isLoading: false }));
  }, [pathname]);

  useEffect(() => {
    // Listen for clicks on navigation elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find the closest clickable element that might navigate
      const clickableElement = target.closest('a, button[data-href], img[data-href], h3[data-href], div[data-href]');
      
      if (clickableElement) {
        const href = clickableElement.getAttribute('href') || clickableElement.getAttribute('data-href');
        
        // Only show loader for internal navigation
        if (href && (href.startsWith('/') || href.startsWith('#'))) {
          // Avoid showing loader for same page navigation
          if (href !== pathname && !href.startsWith('#')) {
            const pageType = getPageType(href);
            setLoadingState({ isLoading: true, pageType });
          }
        }
      }
    };

    // Add event listener
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname]);

  if (!loadingState.isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      {/* Elegant top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
        <div className="h-full bg-gradient-to-r from-[#7d3600] via-[#EDBC7E] to-[#7d3600] animate-loading-bar origin-left"></div>
      </div>

      {/* Page-specific skeleton loading */}
      <div className="pt-1">
        {loadingState.pageType === 'home' && <HomePageSkeleton />}
        {loadingState.pageType === 'products' && <ProductsPageSkeleton />}
        {loadingState.pageType === 'product' && <ProductDetailSkeleton />}
        {loadingState.pageType === 'cart' && <CartPageSkeleton />}
        {loadingState.pageType === 'other' && <GenericPageSkeleton />}
      </div>

    </div>
  );
};

// Home Page Skeleton
const HomePageSkeleton = () => (
  <div className="min-h-screen bg-[#F9F1E6]">
    {/* Header Skeleton */}
    <div className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Hero Banner Skeleton */}
    <div className="relative h-96 bg-gradient-to-r from-[#EDBC7E]/20 to-[#7d3600]/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="h-12 w-96 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse mx-auto"></div>
          <div className="h-6 w-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mx-auto"></div>
          <div className="h-12 w-40 bg-gradient-to-r from-[#7d3600]/30 to-[#EDBC7E]/30 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>

    {/* Categories Skeleton */}
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse mx-auto mb-4"></div>
          <div className="h-4 w-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
              <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Products Page Skeleton  
const ProductsPageSkeleton = () => (
  <div className="min-h-screen bg-[#F9F1E6]">
    {/* Header Skeleton */}
    <div className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Category Hero */}
    <div className="bg-gradient-to-r from-[#7d3600] to-[#EDBC7E] py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="h-10 w-64 bg-white/30 rounded animate-pulse mx-auto mb-4"></div>
        <div className="h-6 w-96 bg-white/20 rounded animate-pulse mx-auto"></div>
      </div>
    </div>

    {/* Products Grid */}
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gradient-to-r from-[#7d3600]/20 to-[#EDBC7E]/20 rounded w-1/2"></div>
                <div className="h-10 bg-gradient-to-r from-[#7d3600]/30 to-[#EDBC7E]/30 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Product Detail Skeleton
const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-[#F9F1E6]">
    {/* Header Skeleton */}
    <div className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-3/4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-[#7d3600]/20 to-[#EDBC7E]/20 rounded w-1/3 animate-pulse"></div>
            <div className="h-12 bg-gradient-to-r from-[#7d3600]/30 to-[#EDBC7E]/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Cart Page Skeleton
const CartPageSkeleton = () => (
  <div className="min-h-screen bg-[#F9F1E6]">
    {/* Header Skeleton */}
    <div className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse mb-8"></div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({length: 3}).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gradient-to-r from-[#7d3600]/20 to-[#EDBC7E]/20 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 h-fit animate-pulse">
            <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-full"></div>
              <div className="h-12 bg-gradient-to-r from-[#7d3600]/30 to-[#EDBC7E]/30 rounded-full mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Generic Page Skeleton
const GenericPageSkeleton = () => (
  <div className="min-h-screen bg-[#F9F1E6]">
    {/* Header Skeleton */}
    <div className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-1/2 animate-pulse"></div>
        <div className="space-y-4">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PageTransitionLoader;
