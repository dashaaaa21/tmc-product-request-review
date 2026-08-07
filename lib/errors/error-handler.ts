import { NextResponse } from 'next/server';
import { ApiError } from './api-error';
import { ZodError } from 'zod';
import { ApiResponse } from '@/types/request.types';

/**
 * Handle errors and return appropriate NextResponse
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  // Log error for debugging
  console.error('API Error:', error);

  // Handle custom ApiError
  if (error instanceof ApiError) {
    return NextResponse.json<ApiResponse>(
      { 
        error: error.message,
        code: error.code 
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const firstError = error.errors[0];
    return NextResponse.json<ApiResponse>(
      { 
        error: firstError.message,
        code: 'VALIDATION_ERROR',
        details: error.errors
      },
      { status: 400 }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string };
    
    // Handle specific Supabase error codes
    switch (supabaseError.code) {
      case '23505': // unique_violation
        return NextResponse.json<ApiResponse>(
          { 
            error: 'Resource already exists',
            code: 'DUPLICATE_RESOURCE'
          },
          { status: 409 }
        );
      
      case '23503': // foreign_key_violation
        return NextResponse.json<ApiResponse>(
          { 
            error: 'Referenced resource not found',
            code: 'INVALID_REFERENCE'
          },
          { status: 400 }
        );
      
      case 'PGRST116': // not found
        return NextResponse.json<ApiResponse>(
          { 
            error: 'Resource not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      
      default:
        return NextResponse.json<ApiResponse>(
          { 
            error: supabaseError.message || 'Database operation failed',
            code: 'DATABASE_ERROR'
          },
          { status: 500 }
        );
    }
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return NextResponse.json<ApiResponse>(
      { 
        error: error.message || 'An unexpected error occurred',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json<ApiResponse>(
    { 
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    },
    { status: 500 }
  );
}

/**
 * Validate authentication
 */
export function validateAuth(user: any): void {
  if (!user) {
    throw new ApiError('Authentication required', 401, 'UNAUTHORIZED');
  }
}
