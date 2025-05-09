const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const axios = require('axios');

/**
 * Middleware to verify JWT token
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

/**
 * Middleware to check if user is a healthcare provider (doctor or staff)
 */
exports.isHealthcareProvider = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Healthcare provider role required.' });
  }
};

/**
 * Middleware to check if user is authorized to access patient data
 * This checks if the user is the patient, their doctor, or staff
 */
exports.isAuthorizedForPatient = async (req, res, next) => {
  const patientId = parseInt(req.params.patientId);
  
  try {
    // If user is the patient
    if (req.user.role === 'patient' && req.user.id === patientId) {
      return next();
    }
    
    // If user is admin, always allow
    if (req.user.role === 'admin') {
      return next();
    }
    
    // If user is doctor or staff, check if they're associated with this patient
    if (req.user.role === 'doctor' || req.user.role === 'staff') {
      // In a real implementation, we would check if the doctor/staff
      // is assigned to this patient by calling the patient service API
      // For now, we'll simulate this check
      
      /* Example of real implementation
      const response = await axios.get(
        `${process.env.PATIENT_SERVICE_URL}/api/patients/${patientId}/providers/${req.user.id}`,
        {
          headers: { Authorization: req.headers.authorization }
        }
      );
      
      if (response.data.isAssigned) {
        return next();
      }
      */
      
      // Simplified version for now - allowing all doctors/staff
      return next();
    }
    
    return res.status(403).json({ message: 'You are not authorized to access this patient\'s records' });
  } catch (err) {
    logger.error(`Authorization error for patient ${patientId}:`, err);
    next(err);
  }
};

/**
 * Middleware to check if user is authorized to access a specific medical record
 */
exports.isAuthorizedForRecord = async (req, res, next) => {
  const recordId = parseInt(req.params.id);
  
  try {
    // First, get the record to check the patient ID
    const recordResult = await req.db.query(
      'SELECT patient_id, doctor_id FROM medical_records WHERE id = $1',
      [recordId]
    );
    
    if (recordResult.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    const record = recordResult.rows[0];
    
    // If user is admin, always allow
    if (req.user.role === 'admin') {
      return next();
    }
    
    // If user is the patient
    if (req.user.role === 'patient' && req.user.id === record.patient_id) {
      return next();
    }
    
    // If user is the doctor who created the record
    if (req.user.role === 'doctor' && req.user.id === record.doctor_id) {
      return next();
    }
    
    // If user is doctor or staff, check if they're associated with this patient
    if (req.user.role === 'doctor' || req.user.role === 'staff') {
      // In a real implementation, we would check if the doctor/staff
      // is assigned to this patient by calling the patient service API
      // For now, we'll simulate this check
      
      /* Example of real implementation
      const response = await axios.get(
        `${process.env.PATIENT_SERVICE_URL}/api/patients/${record.patient_id}/providers/${req.user.id}`,
        {
          headers: { Authorization: req.headers.authorization }
        }
      );
      
      if (response.data.isAssigned) {
        return next();
      }
      */
      
      // Simplified version for now - allowing all doctors/staff
      return next();
    }
    
    return res.status(403).json({ message: 'You are not authorized to access this record' });
  } catch (err) {
    logger.error(`Authorization error for record ${recordId}:`, err);
    next(err);
  }
};