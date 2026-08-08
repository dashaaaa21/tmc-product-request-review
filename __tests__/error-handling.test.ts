import { describe, it, expect } from 'vitest';
import { ApiError } from '@/lib/errors/api-error';
import { handleSupabaseError, isSupabaseError } from '@/lib/errors/supabase-error';

describe('ApiError', () => {
  it('should create error with correct properties', () => {
    const error = new ApiError('Test error', 400, 'TEST_CODE');
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('TEST_CODE');
    expect(error.name).toBe('ApiError');
  });

  it('should be instance of Error', () => {
    const error = new ApiError('Test', 500, 'CODE');
    expect(error instanceof Error).toBe(true);
  });
});

describe('Supabase Error Handling', () => {
  it('should identify valid Supabase error', () => {
    const supabaseError = {
      code: '23505',
      message: 'duplicate key',
      details: 'some details',
    };

    expect(isSupabaseError(supabaseError)).toBe(true);
  });

  it('should reject invalid error object', () => {
    const invalidError = {
      message: 'error',
    };

    expect(isSupabaseError(invalidError)).toBe(false);
  });

  it('should handle unique violation error', () => {
    const supabaseError = {
      code: '23505',
      message: 'duplicate key',
      details: '',
      hint: '',
    } as unknown as import('@supabase/supabase-js').PostgrestError;

    const apiError = handleSupabaseError(supabaseError, 'Test operation');
    
    expect(apiError.statusCode).toBe(409);
    expect(apiError.code).toBe('DUPLICATE_RESOURCE');
    expect(apiError.message).toContain('already exists');
  });

  it('should handle foreign key violation', () => {
    const supabaseError = {
      code: '23503',
      message: 'foreign key violation',
      details: '',
      hint: '',
    } as unknown as import('@supabase/supabase-js').PostgrestError;

    const apiError = handleSupabaseError(supabaseError, 'Test operation');
    
    expect(apiError.statusCode).toBe(400);
    expect(apiError.code).toBe('INVALID_REFERENCE');
  });

  it('should handle not found error', () => {
    const supabaseError = {
      code: 'PGRST116',
      message: 'not found',
      details: '',
      hint: '',
    } as unknown as import('@supabase/supabase-js').PostgrestError;

    const apiError = handleSupabaseError(supabaseError, 'Test operation');
    
    expect(apiError.statusCode).toBe(404);
    expect(apiError.code).toBe('NOT_FOUND');
  });

  it('should handle generic database error', () => {
    const supabaseError = {
      code: 'UNKNOWN',
      message: 'database error',
      details: '',
      hint: '',
    } as unknown as import('@supabase/supabase-js').PostgrestError;

    const apiError = handleSupabaseError(supabaseError, 'Test operation');
    
    expect(apiError.statusCode).toBe(500);
    expect(apiError.code).toBe('DATABASE_ERROR');
  });
});
