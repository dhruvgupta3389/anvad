"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#F9F1E6] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application Error
            </h1>

            <p className="text-gray-600 mb-6">
              We're experiencing some technical difficulties. Our team has been notified and is working to fix this issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={reset}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-[#7d3600] hover:bg-[#5d2b00]"
              >
                Go Home
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Error ID: {error.digest}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
