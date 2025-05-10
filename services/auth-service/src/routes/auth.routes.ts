import express from 'express';
import { login, register, getProfile } from '../controllers/auth.controller';
import { loginValidator, registerValidator } from '../validators/auth.validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', loginValidator, validateRequest, login);

/**
 * @route POST /api/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', registerValidator, validateRequest, register);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authenticate, getProfile);

export default router; 