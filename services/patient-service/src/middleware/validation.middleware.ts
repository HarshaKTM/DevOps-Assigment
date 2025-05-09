import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from './error.middleware';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => {
      return {
        field: error.type === 'field' ? error.path : error.type,
        message: error.msg
      };
    });
    
    return next(new ApiError(400, 'Validation error', 'VALIDATION_ERROR'));
  }
  
  next();
}; 