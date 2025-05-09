const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateDoctor } = require('../middleware/validation.middleware');

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Get doctors by specialization
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);

// Get doctor availability
router.get('/:id/availability', doctorController.getDoctorAvailability);

// Admin routes - protected with authentication middleware
// Create a new doctor
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, validateDoctor, doctorController.createDoctor);

// Update a doctor
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, validateDoctor, doctorController.updateDoctor);

// Delete a doctor
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, doctorController.deleteDoctor);

module.exports = router; 