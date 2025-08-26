// Input sanitization utilities for production safety

export function sanitizeString(input: any, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

export function sanitizeNumber(input: any, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
  const num = parseFloat(input);
  if (isNaN(num)) {
    return min;
  }
  return Math.min(Math.max(num, min), max);
}

export function sanitizeInteger(input: any, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
  const num = parseInt(input);
  if (isNaN(num)) {
    return min;
  }
  return Math.min(Math.max(num, min), max);
}

export function sanitizeBoolean(input: any): boolean {
  if (typeof input === 'boolean') {
    return input;
  }
  if (typeof input === 'string') {
    return input.toLowerCase() === 'true';
  }
  return false;
}

export function sanitizeEmail(input: any): string {
  const email = sanitizeString(input, 255);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : '';
}

export function sanitizeSlug(input: any): string {
  const slug = sanitizeString(input, 100);
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Sanitize objects recursively
export function sanitizeObject<T>(obj: any, schema: Record<string, (value: any) => any>): Partial<T> {
  const result: Partial<T> = {};
  
  for (const [key, sanitizer] of Object.entries(schema)) {
    if (obj && obj.hasOwnProperty(key)) {
      try {
        (result as any)[key] = sanitizer(obj[key]);
      } catch (error) {
        console.warn(`Sanitization error for key ${key}:`, error);
        // Skip invalid fields
      }
    }
  }
  
  return result;
}
