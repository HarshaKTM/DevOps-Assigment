import { Request, Response, NextFunction } from 'express';
import Patient from '../models/patient.model';
import { ApiError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { setupLogging } from '../config/logging';
import { Op } from 'sequelize';

const logger = setupLogging();

// Get current patient's profile
export const getPatientProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    
    const patient = await Patient.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!patient) {
      return next(ApiError.notFound('Patient not found'));
    }
    
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Update current patient's profile
export const updatePatientProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    
    const patient = await Patient.findByPk(req.user.id);
    
    if (!patient) {
      return next(ApiError.notFound('Patient not found'));
    }
    
    // Fields that can be updated by the patient
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'address',
      'emergencyContact',
      'insuranceInfo',
    ];
    
    // Filter request body to only include allowed fields
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    
    // Update patient
    await patient.update(updates);
    
    res.status(200).json({
      success: true,
      data: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        insuranceInfo: patient.insuranceInfo,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all patients (for admin/doctor)
export const getPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    
    // Build search condition if search parameter is provided
    const whereCondition = search
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    
    // Get patients with pagination
    const { count, rows: patients } = await Patient.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasMore = page < totalPages;
    
    res.status(200).json({
      success: true,
      data: patients,
      meta: {
        page,
        limit,
        total: count,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get patient by ID (for admin/doctor)
export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!patient) {
      return next(ApiError.notFound('Patient not found'));
    }
    
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Update patient medical history (for doctor)
export const updatePatientMedicalHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { medicalHistory } = req.body;
    
    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      return next(ApiError.notFound('Patient not found'));
    }
    
    // Update medical history
    await patient.update({ medicalHistory });
    
    res.status(200).json({
      success: true,
      message: 'Medical history updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate a patient (for admin)
export const deactivatePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      return next(ApiError.notFound('Patient not found'));
    }
    
    // Deactivate patient
    await patient.update({ isActive: false });
    
    res.status(200).json({
      success: true,
      message: 'Patient deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
}; 