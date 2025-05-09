const Doctor = require('../models/doctor.model');
const logger = require('../utils/logger');

/**
 * Get all doctors
 */
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ isActive: true });
    return res.status(200).json(doctors);
  } catch (err) {
    logger.error('Error getting all doctors:', err);
    next(err);
  }
};

/**
 * Get doctor by ID
 */
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    return res.status(200).json(doctor);
  } catch (err) {
    logger.error(`Error getting doctor with id ${req.params.id}:`, err);
    next(err);
  }
};

/**
 * Get doctors by specialization
 */
exports.getDoctorsBySpecialization = async (req, res, next) => {
  try {
    const { specialization } = req.params;
    const doctors = await Doctor.find({ 
      specialization, 
      isActive: true 
    });
    
    return res.status(200).json(doctors);
  } catch (err) {
    logger.error(`Error getting doctors by specialization ${req.params.specialization}:`, err);
    next(err);
  }
};

/**
 * Create a new doctor
 */
exports.createDoctor = async (req, res, next) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    
    return res.status(201).json(newDoctor);
  } catch (err) {
    logger.error('Error creating doctor:', err);
    next(err);
  }
};

/**
 * Update a doctor
 */
exports.updateDoctor = async (req, res, next) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    return res.status(200).json(updatedDoctor);
  } catch (err) {
    logger.error(`Error updating doctor with id ${req.params.id}:`, err);
    next(err);
  }
};

/**
 * Delete a doctor (set isActive to false)
 */
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    return res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    logger.error(`Error deleting doctor with id ${req.params.id}:`, err);
    next(err);
  }
};

/**
 * Get doctor availability
 */
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Get day of week from date
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    // Find availability for the day
    const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return res.status(200).json({ 
        available: false,
        message: 'Doctor is not available on this day' 
      });
    }
    
    // In a real implementation, we would check booked appointments against the availability
    // For now, return the raw availability
    return res.status(200).json({
      available: true,
      start: dayAvailability.start,
      end: dayAvailability.end,
      // In a real app, we would calculate available time slots here
      timeSlots: generateTimeSlots(dayAvailability.start, dayAvailability.end)
    });
    
  } catch (err) {
    logger.error(`Error getting doctor availability for id ${req.params.id}:`, err);
    next(err);
  }
};

/**
 * Helper function to generate time slots from start and end times
 */
function generateTimeSlots(start, end) {
  const slots = [];
  const slotDuration = 30; // 30 minutes slots
  
  const startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);
  
  let currentTime = new Date(startTime);
  
  while (currentTime < endTime) {
    const timeString = currentTime.toTimeString().substring(0, 5);
    slots.push({
      time: timeString,
      isAvailable: true // In a real app, this would be determined by booked appointments
    });
    
    currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
  }
  
  return slots;
} 