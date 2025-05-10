import { Router } from 'express';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get all patients
router.get('/', async (req, res, next) => {
  try {
    // TODO: Implement patient listing
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Create new patient
router.post('/', async (req, res, next) => {
  try {
    // TODO: Implement patient creation
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Get patient by ID
router.get('/:id', async (req, res, next) => {
  try {
    // TODO: Implement get patient by ID
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Update patient
router.put('/:id', async (req, res, next) => {
  try {
    // TODO: Implement patient update
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Delete patient
router.delete('/:id', async (req, res, next) => {
  try {
    // TODO: Implement patient deletion
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

export default router; 