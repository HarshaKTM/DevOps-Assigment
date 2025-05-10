import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointment,
  cancelAppointment,
  getAppointmentsForDoctor,
  getAppointmentsForPatient,
  completeAppointment
} from '../controllers/appointment.controller';
import { Router } from 'express';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Create a new appointment
router.post(
  '/',
  authenticate,
  [
    body('patientId').isInt().withMessage('Patient ID must be an integer'),
    body('doctorId').isInt().withMessage('Doctor ID must be an integer'),
    body('startTime').isISO8601().toDate().withMessage('Start time must be a valid date'),
    body('endTime').isISO8601().toDate().withMessage('End time must be a valid date'),
    body('type')
      .isIn(['regular', 'follow-up', 'emergency', 'telemedicine'])
      .withMessage('Type must be one of: regular, follow-up, emergency, telemedicine'),
    body('reason').optional().isString().withMessage('Reason must be a string'),
    body('location').optional().isString().withMessage('Location must be a string'),
    validateRequest,
  ],
  createAppointment
);

// Get all appointments with pagination and filtering
router.get(
  '/',
  authenticate,
  authorize(['admin', 'staff']),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['scheduled', 'completed', 'canceled', 'no-show']).withMessage('Invalid status'),
    query('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid date'),
    validateRequest,
  ],
  getAllAppointments
);

// Get appointments for a specific doctor
router.get(
  '/doctor/:doctorId',
  authenticate,
  [
    param('doctorId').isInt().withMessage('Doctor ID must be an integer'),
    query('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid date'),
    query('status').optional().isIn(['scheduled', 'completed', 'canceled', 'no-show']).withMessage('Invalid status'),
    validateRequest,
  ],
  getAppointmentsForDoctor
);

// Get appointments for a specific patient
router.get(
  '/patient/:patientId',
  authenticate,
  [
    param('patientId').isInt().withMessage('Patient ID must be an integer'),
    query('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid date'),
    query('status').optional().isIn(['scheduled', 'completed', 'canceled', 'no-show']).withMessage('Invalid status'),
    validateRequest,
  ],
  getAppointmentsForPatient
);

// Get a specific appointment by ID
router.get(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Appointment ID must be an integer'),
    validateRequest,
  ],
  getAppointmentById
);

// Update an appointment
router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Appointment ID must be an integer'),
    body('startTime').optional().isISO8601().toDate().withMessage('Start time must be a valid date'),
    body('endTime').optional().isISO8601().toDate().withMessage('End time must be a valid date'),
    body('type')
      .optional()
      .isIn(['regular', 'follow-up', 'emergency', 'telemedicine'])
      .withMessage('Type must be one of: regular, follow-up, emergency, telemedicine'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('location').optional().isString().withMessage('Location must be a string'),
    validateRequest,
  ],
  updateAppointment
);

// Cancel an appointment
router.put(
  '/:id/cancel',
  authenticate,
  [
    param('id').isInt().withMessage('Appointment ID must be an integer'),
    body('reason').optional().isString().withMessage('Reason must be a string'),
    validateRequest,
  ],
  cancelAppointment
);

// Mark an appointment as completed
router.put(
  '/:id/complete',
  authenticate,
  authorize(['doctor', 'admin']),
  [
    param('id').isInt().withMessage('Appointment ID must be an integer'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    validateRequest,
  ],
  completeAppointment
);

// Get all appointments
router.get('/', async (req, res, next) => {
  try {
    // TODO: Implement appointment listing
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

// Delete appointment
router.delete('/:id', async (req, res, next) => {
  try {
    // TODO: Implement appointment deletion
    throw new AppError('Not implemented', 501);
  } catch (error) {
    next(error);
  }
});

export default router; 