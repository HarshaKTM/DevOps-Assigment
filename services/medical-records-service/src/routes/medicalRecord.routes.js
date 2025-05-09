const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecord.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Get all medical records for a patient
router.get('/patient/:patientId', 
  authMiddleware.verifyToken, 
  authMiddleware.isAuthorizedForPatient,
  medicalRecordController.getPatientRecords
);

// Get medical records by type for a patient
router.get('/patient/:patientId/type/:type', 
  authMiddleware.verifyToken, 
  authMiddleware.isAuthorizedForPatient,
  medicalRecordController.getRecordsByType
);

// Get recent medical records for a patient
router.get('/patient/:patientId/recent', 
  authMiddleware.verifyToken, 
  authMiddleware.isAuthorizedForPatient,
  medicalRecordController.getRecentRecords
);

// Get a specific medical record by ID
router.get('/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isAuthorizedForRecord,
  medicalRecordController.getRecordById
);

// Create a new medical record (doctors and staff only)
router.post('/', 
  authMiddleware.verifyToken, 
  authMiddleware.isHealthcareProvider,
  medicalRecordController.createRecord
);

// Update a medical record (doctors and staff only)
router.put('/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isHealthcareProvider,
  authMiddleware.isAuthorizedForRecord,
  medicalRecordController.updateRecord
);

// Add an attachment to a medical record (doctors and staff only)
router.post('/:id/attachments', 
  authMiddleware.verifyToken, 
  authMiddleware.isHealthcareProvider,
  authMiddleware.isAuthorizedForRecord,
  upload.single('file'),
  medicalRecordController.addAttachment
);

// Download an attachment
router.get('/:id/attachments/:attachmentId', 
  authMiddleware.verifyToken, 
  authMiddleware.isAuthorizedForRecord,
  medicalRecordController.downloadAttachment
);

// Delete a medical record (doctors and staff only)
router.delete('/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isHealthcareProvider,
  authMiddleware.isAuthorizedForRecord,
  medicalRecordController.deleteRecord
);

module.exports = router; 