import { NextResponse } from 'next/server';
import { z } from 'zod';
import { securityHeaders } from '../security/headers';

/**
 * HTTP response utilities for Next.js API routes
 * Provides type-safe response builders and error handling
 */

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
  };
}

/**
 * Creates a successful JSON response with security headers
 */
export function jsonResponse<T>(
  data: T,
  options: { status?: number; meta?: Record<string, unknown> } = {}
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...options.meta,
    },
  };

  return NextResponse.json(response, {
    status: options.status || 200,
    headers: securityHeaders,
  });
}

/**
 * Creates an error response with security headers
 * Never exposes stack traces or sensitive information
 */
export function errorResponse(
  message: string,
  options: {
    status?: number;
    code?: string;
    details?: unknown;
    logError?: unknown;
  } = {}
): NextResponse<ApiErrorResponse> {
  // Log detailed error server-side
  if (options.logError) {
    console.error('[API Error]', {
      message,
      code: options.code,
      error: options.logError,
    });
  }

  // Return sanitized error to client
  const response: ApiErrorResponse = {
    error: {
      message,
      code: options.code,
      // Only include details in development
      ...(process.env.NODE_ENV === 'development' && options.details
        ? { details: options.details }
        : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(response, {
    status: options.status || 500,
    headers: securityHeaders,
  });
}

/**
 * Common error responses
 */
export const commonErrors = {
  badRequest: (message = 'Bad Request') =>
    errorResponse(message, { status: 400, code: 'BAD_REQUEST' }),

  unauthorized: (message = 'Unauthorized') =>
    errorResponse(message, { status: 401, code: 'UNAUTHORIZED' }),

  forbidden: (message = 'Forbidden') =>
    errorResponse(message, { status: 403, code: 'FORBIDDEN' }),

  notFound: (message = 'Resource not found') =>
    errorResponse(message, { status: 404, code: 'NOT_FOUND' }),

  methodNotAllowed: (message = 'Method not allowed') =>
    errorResponse(message, { status: 405, code: 'METHOD_NOT_ALLOWED' }),

  internalError: (message = 'Internal server error') =>
    errorResponse(message, { status: 500, code: 'INTERNAL_ERROR' }),

  validationError: (details?: unknown) =>
    errorResponse('Validation failed', {
      status: 422,
      code: 'VALIDATION_ERROR',
      details,
    }),
};

/**
 * Validates request body with Zod schema
 * Returns parsed data or throws validation error
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid request body', error.errors);
    }
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Validates query parameters with Zod schema
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid query parameters', error.errors);
    }
    throw new Error('Invalid query parameters');
  }
}

/**
 * Custom validation error
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: z.ZodIssue[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error handler wrapper for API routes
 * Catches all errors and returns appropriate responses
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ValidationError) {
        return commonErrors.validationError(error.errors);
      }

      if (error instanceof Error) {
        return errorResponse(error.message, {
          status: 500,
          logError: error,
        });
      }

      return commonErrors.internalError();
    }
  };
}
