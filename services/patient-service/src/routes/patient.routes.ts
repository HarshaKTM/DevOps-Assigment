import express from 'express';
import { param, body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  getPatientProfile,
  updatePatientProfile,
  getPatients,
  getPatientById,
  updatePatientMedicalHistory,
  deactivatePatient
} from '../controllers/patient.controller';

const router = express.Router();

// Get patient's own profile (authenticated patient)
router.get(
  '/profile',
  authenticate,
  getPatientProfile
);

// Update patient's own profile
router.put(
  '/profile',
  authenticate,
  [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    body('emergencyContact').optional(),
    body('insuranceInfo').optional(),
    validateRequest,
  ],
  updatePatientProfile
);

// Get all patients (admin/doctor only)
router.get(
  '/',
  authenticate,
  authorize(['admin', 'doctor']),
  getPatients
);

// Get patient by ID (admin/doctor only)
router.get(
  '/:id',
  authenticate,
  authorize(['admin', 'doctor']),
  [
    param('id').isInt().withMessage('Patient ID must be an integer'),
    validateRequest,
  ],
  getPatientById
);

// Update patient medical history (doctor only)
router.put(
  '/:id/medical-history',
  authenticate,
  authorize(['doctor']),
  [
    param('id').isInt().withMessage('Patient ID must be an integer'),
    body('medicalHistory').notEmpty().withMessage('Medical history is required'),
    validateRequest,
  ],
  updatePatientMedicalHistory
);

// Deactivate a patient (admin only)
router.put(
  '/:id/deactivate',
  authenticate,
  authorize(['admin']),
  [
    param('id').isInt().withMessage('Patient ID must be an integer'),
    validateRequest,
  ],
  deactivatePatient
);

export default router; 