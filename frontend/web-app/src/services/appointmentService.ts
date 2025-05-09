import api from './api';
import { AxiosResponse } from 'axios';

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

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

class AppointmentService {
  /**
   * Get all appointments for a patient
   */
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
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
   * Create a new appointment
   */
  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response: AxiosResponse<Appointment> = await api.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Update an appointment
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
   * Get available time slots for a doctor on a specific date
   */
  async getDoctorTimeSlots(doctorId: number, date: string): Promise<TimeSlot[]> {
    try {
      const response: AxiosResponse<TimeSlot[]> = await api.get(`/api/appointments/doctor/${doctorId}/time-slots`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching time slots for doctor ${doctorId} on ${date}:`, error);
      throw error;
    }
  }

  /**
   * Get all appointments for a doctor
   */
  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    try {
      const response: AxiosResponse<Appointment[]> = await api.get(`/api/appointments/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for doctor ${doctorId}:`, error);
      throw error;
    }
  }

  /**
   * Get appointments for a doctor on a specific date
   */
  async getDoctorAppointmentsByDate(doctorId: number, date: string): Promise<Appointment[]> {
    try {
      const response: AxiosResponse<Appointment[]> = await api.get(`/api/appointments/doctor/${doctorId}/date/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for doctor ${doctorId} on ${date}:`, error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
export default appointmentService; 