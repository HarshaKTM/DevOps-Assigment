import { Request, Response, NextFunction } from 'express';
import { setupLogging } from '../config/logging';

const logger = setupLogging();

// Custom API Error class
export class ApiError extends Error {
  statusCode: number;
  errors?: any;
  
  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
  
  static badRequest(message: string, errors?: any) {
    return new ApiError(400, message, errors);
  }
  
  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, message);
  }
  
  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, message);
  }
  
  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message);
  }
  
  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message);
  }
}

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  
  // If the error isn't an ApiError, convert it
  if (!(error instanceof ApiError)) {
    let statusCode = 500;
    
    // Map known error types to status codes
    if (error.name === 'SequelizeValidationError') {
      statusCode = 400;
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 409;
    }
    
    error = new ApiError(statusCode, error.message, error.errors);
  }
  
  // Log the error
  if (error.statusCode >= 500) {
    logger.error(`${error.message}`, { stack: error.stack });
  } else {
    logger.warn(`${error.message}`);
  }
  
  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    ...(error.errors && { errors: error.errors }),
  });
}; 