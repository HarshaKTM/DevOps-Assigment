import { Request, Response, NextFunction } from 'express';
import { setupLogging } from '../config/logging';

const logger = setupLogging();

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log the error
  logger.error(`${statusCode} - ${message}`, {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    path: req.path,
    method: req.method,
    ip: req.ip,
  });
  
  // Send the error response
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal Server Error'
        : message,
    },
  });
};

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  code?: string;
  
  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message: string) {
    return new ApiError(400, message, 'BAD_REQUEST');
  }
  
  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }
  
  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN');
  }
  
  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }
  
  static internalError(message: string = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
} 