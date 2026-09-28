// Response helpers for consistent API responses
export function success<T>(data: T, message = 'Success') {
  return { success: true, data, message };
}

export function error(code: string, message: string, details?: unknown) {
  return {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  };
}

export const ApiErrors = {
  UNAUTHORIZED: { code: 'UNAUTHORIZED', message: 'Authentication required' },
  FORBIDDEN: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
  NOT_FOUND: (resource: string) => ({ code: 'NOT_FOUND', message: `${resource} not found` }),
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', message: 'Invalid request data' },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  DUPLICATE: (field: string) => ({ code: 'DUPLICATE', message: `${field} already exists` }),
  INVALID_OTP: { code: 'INVALID_OTP', message: 'Invalid or expired OTP' },
  INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', message: 'Invalid mobile number or password' },
};
