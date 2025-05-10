import { Router } from 'express';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    // TODO: Implement user registration
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    // TODO: Implement user login
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    // TODO: Implement get current user
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

export default router; 