"use client"

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contexts/CartContext";
import { SearchProvider } from "@/contexts/SearchContext";
import WelcomePopup from "@/components/WelcomePopup";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoadingIndicator from "@/components/PageLoadingIndicator";
import { WebVitals } from "@/components/WebVitals";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  }));

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SearchProvider>
            <CartProvider>
              <PageLoadingIndicator />
              <WebVitals />
              <Toaster />
              <Sonner />
              <WelcomePopup />
              {children}
            </CartProvider>
          </SearchProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
