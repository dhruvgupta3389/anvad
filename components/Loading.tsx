"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8"
};

export function Loading({ 
  className, 
  size = "md", 
  text = "Loading...", 
  fullScreen = false 
}: LoadingProps) {
  const content = (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen && "min-h-screen bg-[#F9F1E6]",
      className
    )}>
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className={cn(
          "animate-spin text-[#7d3600]",
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-gray-600 font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );

  return content;
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-32 sm:h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-30"></div>
      </div>
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-50"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-50"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-2/3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-50"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gradient-to-r from-[#7d3600]/20 via-[#EDBC7E]/20 to-[#7d3600]/20 rounded w-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-50"></div>
          </div>
          <div className="h-10 bg-gradient-to-r from-[#7d3600]/30 via-[#EDBC7E]/30 to-[#7d3600]/30 rounded-full w-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-8 w-32" />
          <div className="flex items-center space-x-4">
            <LoadingSkeleton className="h-8 w-8 rounded-full" />
            <LoadingSkeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
