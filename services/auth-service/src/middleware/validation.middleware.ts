import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from './error.middleware';

// Middleware to validate request data using express-validator
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Extract validation error messages
    const formattedErrors = errors.array().reduce((acc: Record<string, string>, err: any) => {
      acc[err.param] = err.msg;
      return acc;
    }, {});
    
    return next(ApiError.badRequest('Validation error', formattedErrors));
  }
  
  next();
}; 