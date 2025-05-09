import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Patient from '../models/patient.model';
import { ApiError } from '../middleware/error.middleware';
import { setupLogging } from '../config/logging';

const logger = setupLogging();

// Register a new patient
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ where: { email } });
    
    if (existingPatient) {
      return next(ApiError.badRequest('Email already in use'));
    }
    
    // Create new patient
    const patient = await Patient.create(req.body);
    
    // Generate JWT token
    const token = generateToken(patient);
    
    // Send response with patient data (excluding password)
    res.status(201).json({
      success: true,
      data: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Find patient by email
    const patient = await Patient.findOne({ where: { email } });
    
    if (!patient) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }
    
    // Check if patient is active
    if (!patient.isActive) {
      return next(ApiError.unauthorized('Account is deactivated'));
    }
    
    // Verify password
    const isPasswordValid = await patient.comparePassword(password);
    
    if (!isPasswordValid) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }
    
    // Update last login
    patient.lastLogin = new Date();
    await patient.save();
    
    // Generate JWT token
    const token = generateToken(patient);
    
    // Send response
    res.status(200).json({
      success: true,
      data: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    // Find patient by email
    const patient = await Patient.findOne({ where: { email } });
    
    if (!patient) {
      // Return success even if patient doesn't exist (security)
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent',
      });
    }
    
    // Generate reset token
    const resetToken = uuidv4();
    
    // In a real application, you would send an email with the reset token
    // For this example, we'll just log it
    logger.info(`Reset token for ${email}: ${resetToken}`);
    
    // Here you would typically store the reset token in a database with an expiry
    
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent',
      // Include token in response for development/testing
      ...(process.env.NODE_ENV !== 'production' && { resetToken }),
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    
    // In a real application, you would validate the token against your database
    // For this example, we'll return a success response
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Generate JWT token
const generateToken = (patient: Patient) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  return jwt.sign(
    {
      id: patient.id,
      email: patient.email,
      role: patient.role,
    },
    secret,
    {
      expiresIn: '1d',
    }
  );
};
 