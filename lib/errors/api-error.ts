/**
 * Custom API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Common API errors
 */
export const ApiErrors = {
  // Authentication errors
  UNAUTHORIZED: new ApiError('Authentication required', 401, 'UNAUTHORIZED'),
  FORBIDDEN: new ApiError('Access denied', 403, 'FORBIDDEN'),
  
  // Validation errors
  INVALID_INPUT: (message: string) => new ApiError(message, 400, 'INVALID_INPUT'),
  MISSING_FIELD: (field: string) => new ApiError(`Missing required field: ${field}`, 400, 'MISSING_FIELD'),
  
  // Resource errors
  NOT_FOUND: (resource: string) => new ApiError(`${resource} not found`, 404, 'NOT_FOUND'),
  ALREADY_EXISTS: (resource: string) => new ApiError(`${resource} already exists`, 409, 'ALREADY_EXISTS'),
  
  // Server errors
  INTERNAL_ERROR: new ApiError('Internal server error', 500, 'INTERNAL_ERROR'),
  DATABASE_ERROR: new ApiError('Database operation failed', 500, 'DATABASE_ERROR'),
  EXTERNAL_SERVICE_ERROR: (service: string) => new ApiError(`${service} service error`, 503, 'EXTERNAL_SERVICE_ERROR'),
  
  // Business logic errors
  OPERATION_FAILED: (operation: string) => new ApiError(`Failed to ${operation}`, 500, 'OPERATION_FAILED'),
};
