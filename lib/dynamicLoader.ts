import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface LoadingComponentProps {
  text?: string;
}

interface DynamicImportOptions {
  loading?: ComponentType<LoadingComponentProps>;
  ssr?: boolean;
  suspense?: boolean;
}

// Enhanced dynamic loader with better error handling and loading states
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
) {
  const { 
    ssr = true, 
    suspense = false 
  } = options;

  return dynamic(importFn, {
    ssr,
    suspense,
  });
}

// Pre-configured dynamic components for common use cases
export const DynamicComponentLoaders = {
  // Heavy UI components that can be lazily loaded
  CategoryNavigation: createDynamicComponent(
    () => import('@/components/CategoryNavigation')
  ),
  
  ProductSection: createDynamicComponent(
    () => import('@/components/ProductSection')
  ),
  
  BrandPromise: createDynamicComponent(
    () => import('@/components/BrandPromise')
  ),
  
  Footer: createDynamicComponent(
    () => import('@/components/Footer')
  ),
  
  ProductCard: createDynamicComponent(
    () => import('@/components/ProductCard')
  ),

  // Modal and dialog components (non-SSR for better performance)
  WelcomePopup: createDynamicComponent(
    () => import('@/components/WelcomePopup'),
    { ssr: false }
  ),

  // Chart components (heavy libraries) - using named import
  ChartContainer: createDynamicComponent(
    () => import('@/components/ui/chart').then(mod => ({ default: mod.ChartContainer })),
    { ssr: false }
  ),
};

// Route-based dynamic loading for pages
export const DynamicPages = {
  ProductPage: createDynamicComponent(
    () => import('@/app/product/[id]/page')
  ),
  
  CartPage: createDynamicComponent(
    () => import('@/app/cart/page')
  ),
};

// Utility for preloading components
export function preloadComponent(importFn: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Preload on interaction or when browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 100);
    }
  }
}

// Hook for conditional dynamic imports
export function useDynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  condition: boolean = true
) {
  if (condition && typeof window !== 'undefined') {
    return importFn();
  }
  return Promise.resolve({ default: null as T });
}
