import api from './api';
import { AxiosResponse } from 'axios';

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'regular' | 'follow-up' | 'emergency' | 'consultation';
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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
      const response: AxiosResponse<TimeSlot[]> = await api.get(`/api/appointments/doctor/${doctorId}/slots`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching time slots for doctor ${doctorId} on ${date}:`, error);
      throw error;
    }
  }

  /**
   * Book a new appointment
   */
  async bookAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response: AxiosResponse<Appointment> = await api.post('/api/appointments', appointmentData);
      return response.data;
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
      const response: AxiosResponse<{ success: boolean }> = await api.patch(`/api/appointments/${appointmentId}/cancel`);
      return response.data;
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