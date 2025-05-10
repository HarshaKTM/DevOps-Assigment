import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required')
];

export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('firstName')
    .isString()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .isString()
    .notEmpty()
    .withMessage('Last name is required'),
  body('role')
    .optional()
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Role must be either patient, doctor, or admin')
]; 