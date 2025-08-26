import { NextRequest } from 'next/server';

// Simple in-memory rate limiter for development/production
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  check(identifier: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...recentRequests);
      const resetTime = oldestRequest + this.windowMs;
      return { allowed: false, resetTime };
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return { allowed: true };
  }

  private cleanup() {
    const now = Date.now();
    const cutoff = now - this.windowMs * 2; // Keep some buffer
    
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > cutoff);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Create rate limiter instances
export const apiLimiter = new RateLimiter(60000, 60); // 60 requests per minute
export const strictLimiter = new RateLimiter(60000, 10); // 10 requests per minute for sensitive endpoints

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Use IP address as identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

// Middleware function to apply rate limiting
export function withRateLimit(limiter: RateLimiter) {
  return (request: NextRequest) => {
    const identifier = getClientIdentifier(request);
    return limiter.check(identifier);
  };
}
