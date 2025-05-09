import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Appointment from '../models/appointment.model';
import { ApiError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { setupLogging } from '../config/logging';
import axios from 'axios';
import { 
  publishAppointmentCreated, 
  publishAppointmentUpdated, 
  publishAppointmentCanceled 
} from '../utils/pubsub';

const logger = setupLogging();

// Validate appointment time slot availability
const validateTimeSlot = async (doctorId: number, startTime: Date, endTime: Date, excludeAppointmentId?: number) => {
  const where: any = {
    doctorId,
    status: 'scheduled',
    [Op.or]: [
      {
        // New appointment starts during an existing appointment
        startTime: {
          [Op.lt]: endTime,
        },
        endTime: {
          [Op.gt]: startTime,
        },
      },
      {
        // New appointment ends during an existing appointment
        startTime: {
          [Op.lt]: endTime,
        },
        endTime: {
          [Op.gt]: startTime,
        },
      },
      {
        // New appointment completely overlaps an existing appointment
        startTime: {
          [Op.gte]: startTime,
        },
        endTime: {
          [Op.lte]: endTime,
        },
      },
    ],
  };

  // Exclude current appointment if updating
  if (excludeAppointmentId) {
    where.id = {
      [Op.ne]: excludeAppointmentId,
    };
  }

  const conflictingAppointments = await Appointment.findAll({ where });
  return conflictingAppointments.length === 0;
};

// Validate that doctor exists
const validateDoctor = async (doctorId: number) => {
  try {
    const response = await axios.get(`${process.env.DOCTOR_SERVICE_URL}/api/doctors/${doctorId}`);
    return response.data.success;
  } catch (error) {
    logger.error(`Error validating doctor with ID ${doctorId}:`, error);
    return false;
  }
};

// Validate that patient exists
const validatePatient = async (patientId: number) => {
  try {
    const response = await axios.get(`${process.env.PATIENT_SERVICE_URL}/api/patients/${patientId}`);
    return response.data.success;
  } catch (error) {
    logger.error(`Error validating patient with ID ${patientId}:`, error);
    return false;
  }
};

// Create a new appointment
export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { patientId, doctorId, startTime, endTime, type, reason, location } = req.body;
    
    // Validate doctor exists
    const isDoctorValid = await validateDoctor(doctorId);
    if (!isDoctorValid) {
      return next(ApiError.badRequest(`Doctor with ID ${doctorId} does not exist`));
    }
    
    // Validate patient exists
    const isPatientValid = await validatePatient(patientId);
    if (!isPatientValid) {
      return next(ApiError.badRequest(`Patient with ID ${patientId} does not exist`));
    }
    
    // Check if startTime is before endTime
    if (new Date(startTime) >= new Date(endTime)) {
      return next(ApiError.badRequest('Start time must be before end time'));
    }
    
    // Check if the time slot is available
    const isTimeSlotAvailable = await validateTimeSlot(doctorId, new Date(startTime), new Date(endTime));
    if (!isTimeSlotAvailable) {
      return next(ApiError.conflict('The requested time slot is not available'));
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      startTime,
      endTime,
      type,
      status: 'scheduled',
      reason,
      location,
      createdBy: req.user?.id || 0,
    });
    
    // Publish appointment created event
    await publishAppointmentCreated(appointment.toJSON());
    
    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get appointments with pagination and filtering
export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    // Build where condition
    const whereCondition: any = {};
    
    if (status) {
      whereCondition.status = status;
    }
    
    if (startDate && endDate) {
      whereCondition.startTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereCondition.startTime = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereCondition.startTime = {
        [Op.lte]: new Date(endDate),
      };
    }
    
    // Get appointments with pagination
    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['startTime', 'ASC']],
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasMore = page < totalPages;
    
    res.status(200).json({
      success: true,
      data: appointments,
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

// Get appointments for a specific doctor
export const getAppointmentsForDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { doctorId } = req.params;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const status = req.query.status as string;
    
    // Build where condition
    const whereCondition: any = {
      doctorId: parseInt(doctorId),
    };
    
    if (status) {
      whereCondition.status = status;
    }
    
    if (startDate && endDate) {
      whereCondition.startTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereCondition.startTime = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereCondition.startTime = {
        [Op.lte]: new Date(endDate),
      };
    }
    
    // Get appointments
    const appointments = await Appointment.findAll({
      where: whereCondition,
      order: [['startTime', 'ASC']],
    });
    
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Get appointments for a specific patient
export const getAppointmentsForPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId } = req.params;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const status = req.query.status as string;
    
    // Build where condition
    const whereCondition: any = {
      patientId: parseInt(patientId),
    };
    
    if (status) {
      whereCondition.status = status;
    }
    
    if (startDate && endDate) {
      whereCondition.startTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereCondition.startTime = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereCondition.startTime = {
        [Op.lte]: new Date(endDate),
      };
    }
    
    // Get appointments
    const appointments = await Appointment.findAll({
      where: whereCondition,
      order: [['startTime', 'ASC']],
    });
    
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific appointment by ID
export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return next(ApiError.notFound(`Appointment with ID ${id} not found`));
    }
    
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Update an appointment
export const updateAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, type, notes, location } = req.body;
    
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return next(ApiError.notFound(`Appointment with ID ${id} not found`));
    }
    
    // Verify user has permission to update this appointment
    if (
      req.user?.role !== 'admin' && 
      req.user?.role !== 'staff' &&
      appointment.patientId !== req.user?.id && 
      appointment.doctorId !== req.user?.id
    ) {
      return next(ApiError.forbidden('You do not have permission to update this appointment'));
    }
    
    // Check if appointment is already completed or canceled
    if (appointment.status !== 'scheduled') {
      return next(ApiError.badRequest(`Cannot update a ${appointment.status} appointment`));
    }
    
    // Check if startTime is before endTime
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return next(ApiError.badRequest('Start time must be before end time'));
    }
    
    // If updating time, check if the new time slot is available
    if (startTime || endTime) {
      const newStartTime = startTime ? new Date(startTime) : appointment.startTime;
      const newEndTime = endTime ? new Date(endTime) : appointment.endTime;
      
      const isTimeSlotAvailable = await validateTimeSlot(
        appointment.doctorId, 
        newStartTime, 
        newEndTime, 
        parseInt(id)
      );
      
      if (!isTimeSlotAvailable) {
        return next(ApiError.conflict('The requested time slot is not available'));
      }
    }
    
    // Update appointment
    const updates: any = {};
    if (startTime) updates.startTime = startTime;
    if (endTime) updates.endTime = endTime;
    if (type) updates.type = type;
    if (notes) updates.notes = notes;
    if (location) updates.location = location;
    updates.updatedBy = req.user?.id;
    
    await appointment.update(updates);
    
    // Publish appointment updated event
    await publishAppointmentUpdated(appointment.toJSON());
    
    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Cancel an appointment
export const cancelAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return next(ApiError.notFound(`Appointment with ID ${id} not found`));
    }
    
    // Verify user has permission to cancel this appointment
    if (
      req.user?.role !== 'admin' && 
      req.user?.role !== 'staff' &&
      appointment.patientId !== req.user?.id && 
      appointment.doctorId !== req.user?.id
    ) {
      return next(ApiError.forbidden('You do not have permission to cancel this appointment'));
    }
    
    // Check if appointment is already completed or canceled
    if (appointment.status !== 'scheduled') {
      return next(ApiError.badRequest(`Cannot cancel a ${appointment.status} appointment`));
    }
    
    // Update appointment
    await appointment.update({
      status: 'canceled',
      notes: reason || 'Appointment was canceled.',
      updatedBy: req.user?.id,
    });
    
    // Publish appointment canceled event
    await publishAppointmentCanceled(appointment.toJSON());
    
    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment canceled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Mark an appointment as completed
export const completeAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return next(ApiError.notFound(`Appointment with ID ${id} not found`));
    }
    
    // Only doctor or admin can mark appointment as completed
    if (req.user?.role !== 'admin' && req.user?.role !== 'doctor') {
      return next(ApiError.forbidden('Only doctors or admins can mark appointments as completed'));
    }
    
    // If it's the doctor, verify it's their appointment
    if (req.user?.role === 'doctor' && appointment.doctorId !== req.user.id) {
      return next(ApiError.forbidden('You can only complete your own appointments'));
    }
    
    // Check if appointment is already completed or canceled
    if (appointment.status !== 'scheduled') {
      return next(ApiError.badRequest(`Cannot complete a ${appointment.status} appointment`));
    }
    
    // Update appointment
    await appointment.update({
      status: 'completed',
      notes: notes || appointment.notes,
      updatedBy: req.user?.id,
    });
    
    // Publish appointment updated event
    await publishAppointmentUpdated(appointment.toJSON());
    
    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment marked as completed',
    });
  } catch (error) {
    next(error);
  }
}; 