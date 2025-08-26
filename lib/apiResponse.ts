import { NextResponse } from 'next/server';

export interface ApiError {
  success: false;
  error: string;
  details?: string | string[];
  code?: string;
  timestamp: string;
}

export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
}

export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: string | string[],
  code?: string
): NextResponse {
  const errorResponse: ApiError = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };

  if (details) {
    errorResponse.details = details;
  }

  if (code) {
    errorResponse.code = code;
  }

  const response = NextResponse.json(errorResponse, { status });
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  
  return response;
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, any>
): NextResponse {
  const successResponse: ApiSuccess<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };

  const response = NextResponse.json(successResponse, { status });
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  
  return response;
}

// Common error types
export const API_ERRORS = {
  INVALID_INPUT: 'INVALID_INPUT',
  NOT_FOUND: 'NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

// Status code mappings
export const ERROR_STATUS_CODES = {
  [API_ERRORS.INVALID_INPUT]: 400,
  [API_ERRORS.NOT_FOUND]: 404,
  [API_ERRORS.DATABASE_ERROR]: 500,
  [API_ERRORS.RATE_LIMITED]: 429,
  [API_ERRORS.UNAUTHORIZED]: 401,
  [API_ERRORS.INTERNAL_ERROR]: 500
} as const;
