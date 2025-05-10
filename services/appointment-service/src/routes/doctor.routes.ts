import { Router } from 'express';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get all doctors
router.get('/', async (req, res, next) => {
  try {
    // TODO: Implement doctor listing
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Create new doctor
router.post('/', async (req, res, next) => {
  try {
    // TODO: Implement doctor creation
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Get doctor by ID
router.get('/:id', async (req, res, next) => {
  try {
    // TODO: Implement get doctor by ID
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Update doctor
router.put('/:id', async (req, res, next) => {
  try {
    // TODO: Implement doctor update
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Delete doctor
router.delete('/:id', async (req, res, next) => {
  try {
    // TODO: Implement doctor deletion
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

export default router; 