import { Appointment, AppointmentStatus, AppointmentType, TimeSlot } from '../types/appointment';
import api from './api';

// Development mode with mock data
const isDevEnvironment = true;

// Mock appointments data
const mockAppointments = [
  {
    id: 501,
    patientId: 101,
    doctorId: 201,
    doctorName: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    dateTime: '2023-07-10T09:30:00.000Z',
    duration: 30, // minutes
    status: 'confirmed',
    notes: 'Regular checkup for heart condition',
    createdAt: '2023-06-25T14:30:00.000Z',
    updatedAt: '2023-06-25T14:30:00.000Z'
  },
  {
    id: 502,
    patientId: 101,
    doctorId: 203,
    doctorName: 'Dr. Emily Rodriguez',
    specialization: 'Dermatology',
    dateTime: '2023-07-15T13:00:00.000Z',
    duration: 30, // minutes
    status: 'confirmed',
    notes: 'Follow-up for skin condition',
    createdAt: '2023-06-27T10:15:00.000Z',
    updatedAt: '2023-06-27T10:15:00.000Z'
  },
  {
    id: 503,
    patientId: 101,
    doctorId: 204,
    doctorName: 'Dr. James Wilson',
    specialization: 'General Practice',
    dateTime: '2023-06-05T11:00:00.000Z',
    duration: 30, // minutes
    status: 'completed',
    notes: 'Annual physical examination',
    createdAt: '2023-05-20T08:45:00.000Z',
    updatedAt: '2023-06-05T12:00:00.000Z'
  },
  {
    id: 504,
    patientId: 101,
    doctorId: 202,
    doctorName: 'Dr. Michael Chen',
    specialization: 'Neurology',
    dateTime: '2023-07-25T14:30:00.000Z',
    duration: 45, // minutes
    status: 'pending',
    notes: 'Initial consultation for headaches',
    createdAt: '2023-06-30T16:20:00.000Z',
    updatedAt: '2023-06-30T16:20:00.000Z'
  }
];

class AppointmentApiService {
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return mockAppointments.filter(appointment => appointment.patientId === patientId);
    }
    
    const response = await api.get(`/api/appointments/patient/${patientId}`);
    return response.data.data;
  }

  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const appointment = mockAppointments.find(appointment => appointment.id === appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      return appointment;
    }
    
    const response = await api.get(`/api/appointments/${appointmentId}`);
    return response.data.data;
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newAppointment = {
        id: Math.max(...mockAppointments.map(appointment => appointment.id)) + 1,
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        doctorName: appointmentData.doctorName,
        specialization: appointmentData.specialization,
        dateTime: appointmentData.dateTime || new Date().toISOString(),
        duration: appointmentData.duration || 30,
        status: 'pending',
        notes: appointmentData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Appointment;
      
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
    
    const response = await api.post('/api/appointments', appointmentData);
    return response.data.data;
  }

  async updateAppointment(appointmentId: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const appointmentIndex = mockAppointments.findIndex(appointment => appointment.id === appointmentId);
      if (appointmentIndex === -1) {
        throw new Error('Appointment not found');
      }
      
      const updatedAppointment = {
        ...mockAppointments[appointmentIndex],
        ...appointmentData,
        updatedAt: new Date().toISOString()
      };
      
      mockAppointments[appointmentIndex] = updatedAppointment;
      return updatedAppointment;
    }
    
    const response = await api.put(`/api/appointments/${appointmentId}`, appointmentData);
    return response.data.data;
  }

  async cancelAppointment(appointmentId: number): Promise<{ success: boolean }> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const appointmentIndex = mockAppointments.findIndex(appointment => appointment.id === appointmentId);
      if (appointmentIndex === -1) {
        throw new Error('Appointment not found');
      }
      
      mockAppointments[appointmentIndex].status = 'cancelled';
      mockAppointments[appointmentIndex].updatedAt = new Date().toISOString();
      
      return { success: true };
    }
    
    const response = await api.put(`/api/appointments/${appointmentId}/cancel`);
    return response.data;
  }

  async getUpcomingAppointments(patientId: number): Promise<Appointment[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date();
      return mockAppointments.filter(appointment => 
        appointment.patientId === patientId &&
        (appointment.status === 'confirmed' || appointment.status === 'pending') &&
        new Date(appointment.dateTime) > now
      ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }
    
    const response = await api.get(`/api/appointments/patient/${patientId}/upcoming`);
    return response.data.data;
  }

  async getPastAppointments(patientId: number): Promise<Appointment[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date();
      return mockAppointments.filter(appointment => 
        appointment.patientId === patientId &&
        (appointment.status === 'completed' || appointment.status === 'cancelled' ||
         new Date(appointment.dateTime) < now)
      ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }
    
    const response = await api.get(`/api/appointments/patient/${patientId}/past`);
    return response.data.data;
  }

  async getDoctorTimeSlots(doctorId: number, date: string): Promise<TimeSlot[]> {
    if (isDevEnvironment) {
      // Generate mock time slots for the given date
      const slots: TimeSlot[] = [];
      const baseDate = new Date(date);
      
      // Clinic hours: 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = new Date(baseDate);
          startTime.setHours(hour, minute, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(startTime.getMinutes() + 30);
          
          // Randomly determine if slot is available (70% chance)
          const isAvailable = Math.random() < 0.7;
          
          slots.push({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            isAvailable,
          });
        }
      }
      
      return Promise.resolve(slots);
    }
    
    const response = await api.get(`/api/doctors/${doctorId}/timeslots`, {
      params: { date },
    });
    return response.data.data;
  }
}

export const appointmentApi = new AppointmentApiService();

// Re-export the thunks for convenience
export { 
  fetchAppointments, 
  fetchUpcomingAppointments,
  fetchAppointmentById,
  bookAppointment,
  cancelAppointment
} from '../store/slices/appointmentSlice'; 