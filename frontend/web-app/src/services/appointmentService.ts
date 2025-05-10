import { api } from './api';
import { AxiosResponse } from 'axios';
import { Appointment } from '../store/slices/appointmentSlice';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

// Environment check for using mock data
const isDevEnvironment = process.env.NODE_ENV === 'development';

// Mock appointment data for development
const mockTimeSlots: TimeSlot[] = [
  { startTime: '09:00', endTime: '09:30', available: true },
  { startTime: '09:30', endTime: '10:00', available: true },
  { startTime: '10:00', endTime: '10:30', available: false },
  { startTime: '10:30', endTime: '11:00', available: true },
  { startTime: '11:00', endTime: '11:30', available: true },
  { startTime: '11:30', endTime: '12:00', available: false },
  { startTime: '12:00', endTime: '12:30', available: false },
  { startTime: '12:30', endTime: '13:00', available: false },
  { startTime: '13:00', endTime: '13:30', available: true },
  { startTime: '13:30', endTime: '14:00', available: true },
  { startTime: '14:00', endTime: '14:30', available: true },
  { startTime: '14:30', endTime: '15:00', available: false },
  { startTime: '15:00', endTime: '15:30', available: true },
  { startTime: '15:30', endTime: '16:00', available: true },
  { startTime: '16:00', endTime: '16:30', available: false },
  { startTime: '16:30', endTime: '17:00', available: true },
];

export const mockAppointments: Appointment[] = [];

class AppointmentService {
  /**
   * Get all appointments for a patient
   */
  async getAppointments(patientId: number): Promise<Appointment[]> {
    try {
      const response: AxiosResponse<Appointment[]> = await api.get(`/api/appointments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  }

  /**
   * Get upcoming appointments for a patient
   */
  async getUpcomingAppointments(patientId: number): Promise<Appointment[]> {
    try {
      const response: AxiosResponse<Appointment[]> = await api.get(`/api/appointments/patient/${patientId}/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  }

  /**
   * Get past appointments for a patient
   */
  async getPastAppointments(patientId: number): Promise<Appointment[]> {
    try {
      const response: AxiosResponse<Appointment[]> = await api.get(`/api/appointments/patient/${patientId}/past`);
      return response.data;
    } catch (error) {
      console.error('Error fetching past appointments:', error);
      throw error;
    }
  }

  /**
   * Get a specific appointment by ID
   */
  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    try {
      const response: AxiosResponse<Appointment> = await api.get(`/api/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  /**
   * Get available time slots for a doctor on a specific date
   */
  async getDoctorTimeSlots(doctorId: number, date: string): Promise<TimeSlot[]> {
    try {
      if (isDevEnvironment) {
        // Return mock data for development
        return mockTimeSlots;
      } else {
        // Call the API for production
        const response: AxiosResponse<TimeSlot[]> = await api.get(`/api/appointments/doctor/${doctorId}/slots`, {
          params: { date }
        });
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching time slots for doctor ${doctorId} on ${date}:`, error);
      throw error;
    }
  }

  /**
   * Fetch available time slots for a doctor on a specific date
   * This is an alias for getDoctorTimeSlots for backward compatibility
   */
  async fetchAvailableTimeSlots(doctorId: number, date: string): Promise<TimeSlot[]> {
    return this.getDoctorTimeSlots(doctorId, date);
  }

  /**
   * Book a new appointment
   */
  async bookAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      if (isDevEnvironment) {
        // Create mock appointment for development
        const newAppointment: Appointment = {
          id: Math.floor(Math.random() * 1000) + 1,
          ...appointmentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockAppointments.push(newAppointment);
        return newAppointment;
      } else {
        // Call the API for production
        const response: AxiosResponse<Appointment> = await api.post('/api/appointments', appointmentData);
        return response.data;
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  /**
   * Update an existing appointment
   */
  async updateAppointment(appointmentId: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response: AxiosResponse<Appointment> = await api.put(`/api/appointments/${appointmentId}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: number): Promise<{ success: boolean }> {
    try {
      if (isDevEnvironment) {
        // Update mock appointment for development
        const appointmentIndex = mockAppointments.findIndex(a => a.id === appointmentId);
        if (appointmentIndex === -1) {
          throw new Error('Appointment not found');
        }
        mockAppointments[appointmentIndex] = {
          ...mockAppointments[appointmentIndex],
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        };
        return { success: true };
      } else {
        // Call the API for production
        const response: AxiosResponse<{ success: boolean }> = await api.patch(`/api/appointments/${appointmentId}/cancel`);
        return response.data;
      }
    } catch (error) {
      console.error(`Error cancelling appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  /**
   * Check in a patient for their appointment
   */
  async checkInAppointment(appointmentId: number): Promise<Appointment> {
    try {
      const response: AxiosResponse<Appointment> = await api.patch(`/api/appointments/${appointmentId}/check-in`);
      return response.data;
    } catch (error) {
      console.error(`Error checking in appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  /**
   * Complete an appointment and add notes
   */
  async completeAppointment(appointmentId: number, notes: string): Promise<Appointment> {
    try {
      const response: AxiosResponse<Appointment> = await api.patch(`/api/appointments/${appointmentId}/complete`, { notes });
      return response.data;
    } catch (error) {
      console.error(`Error completing appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  /**
   * Get doctor's upcoming schedule
   */
  async getDoctorSchedule(doctorId: number, startDate: string, endDate: string): Promise<Appointment[]> {
    try {
      const response: AxiosResponse<Appointment[]> = await api.get(`/api/appointments/doctor/${doctorId}/schedule`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule for doctor ${doctorId}:`, error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
export default appointmentService; 