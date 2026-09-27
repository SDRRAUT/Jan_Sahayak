/**
 * JAN_SAHAYAK — STANDARDIZED API ERROR HANDLER & RESPONSE HELPERS
 * Enforces consistent structured error payload format across all API routes.
 */

export class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, code = 'BAD_REQUEST', details = null) {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(message = 'Unauthorized: Access token missing or invalid', code = 'UNAUTHORIZED') {
    return new ApiError(401, code, message);
  }

  static forbidden(message = 'Forbidden: Insufficient permissions for this resource', code = 'FORBIDDEN') {
    return new ApiError(403, code, message);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, code, message);
  }

  static conflict(message, code = 'CONFLICT') {
    return new ApiError(409, code, message);
  }

  static unprocessable(message, code = 'UNPROCESSABLE_ENTITY', details = null) {
    return new ApiError(422, code, message, details);
  }

  static rateLimit(message = 'Rate limit exceeded', code = 'RATE_LIMIT_EXCEEDED') {
    return new ApiError(429, code, message);
  }

  static internal(message = 'An unexpected internal server error occurred', code = 'INTERNAL_ERROR') {
    return new ApiError(500, code, message);
  }

  static serviceUnavailable(message = 'External service temporarily unavailable', code = 'SERVICE_UNAVAILABLE') {
    return new ApiError(503, code, message);
  }
}

export function sendError(res, statusCode, code, message, details = null) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  });
}

export function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to default express handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || (err.status ? err.status : 500);
  const code = err.code || (statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR');
  const message = err.message || 'An unexpected error occurred';

  // Log server error securely (never leak stack or secrets to the client)
  if (statusCode >= 500) {
    console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: statusCode >= 500 && process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : message,
      ...(err.details ? { details: err.details } : {})
    }
  });
}
