const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Validate doctor data
 */
exports.validateDoctor = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('qualifications').notEmpty().withMessage('Qualifications are required'),
  body('yearsOfExperience').isInt({ min: 0 }).withMessage('Years of experience must be a positive number'),
  body('userId').notEmpty().withMessage('User ID is required'),
  
  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      logger.warn('Doctor validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    next();
  }
];

/**
 * Validate availability data
 */
exports.validateAvailability = [
  body('day')
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Day must be a valid day of the week'),
  body('start').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in format HH:MM'),
  body('end').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in format HH:MM'),
  body('isAvailable').isBoolean().withMessage('IsAvailable must be a boolean'),
  
  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      logger.warn('Availability validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    next();
  }
]; 