import { api } from './api';
import { AxiosResponse } from 'axios';
import { Doctor } from '../store/slices/doctorSlice';

// Mock data for development
const isDevEnvironment = true;

// Mock doctors data
const mockDoctors = [
  {
    id: 201,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    specialization: 'Cardiology',
    qualifications: 'MD, FACC',
    yearsOfExperience: 12,
    avatar: 'https://i.pravatar.cc/150?u=doctor1',
    bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions.',
    availability: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '13:00' },
    }
  },
  {
    id: 202,
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@example.com',
    specialization: 'Neurology',
    qualifications: 'MD, PhD',
    yearsOfExperience: 15,
    avatar: 'https://i.pravatar.cc/150?u=doctor2',
    bio: 'Dr. Michael Chen is a neurologist specializing in the treatment of neurological disorders and stroke care.',
    availability: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '16:00' },
    }
  },
  {
    id: 203,
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@example.com',
    specialization: 'Dermatology',
    qualifications: 'MD, FAAD',
    yearsOfExperience: 8,
    avatar: 'https://i.pravatar.cc/150?u=doctor3',
    bio: 'Dr. Emily Rodriguez is a dermatologist who treats a wide range of skin conditions from acne to skin cancer.',
    availability: {
      monday: { start: '09:00', end: '16:00' },
      tuesday: { start: '09:00', end: '16:00' },
      wednesday: { start: '09:00', end: '16:00' },
      thursday: { start: '09:00', end: '16:00' },
      friday: { start: '09:00', end: '14:00' },
    }
  },
  {
    id: 204,
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@example.com',
    specialization: 'General Practice',
    qualifications: 'MD',
    yearsOfExperience: 20,
    avatar: 'https://i.pravatar.cc/150?u=doctor4',
    bio: 'Dr. James Wilson is an experienced family physician who provides comprehensive primary care for patients of all ages.',
    availability: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '15:00' },
    }
  },
];

export interface DoctorSchedule {
  doctorId: number;
  schedule: {
    [day: string]: {
      start: string;
      end: string;
      isAvailable: boolean;
    };
  };
}

class DoctorService {
  /**
   * Get all doctors
   */
  async getAllDoctors(): Promise<Doctor[]> {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDoctors.map(doctor => ({
        ...doctor,
        qualifications: [doctor.qualifications],
        education: [{
          degree: 'MD',
          institution: 'Medical School',
          year: 2010
        }],
        about: doctor.bio
      }));
    }
    
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  /**
   * Get a specific doctor by ID
   */
  async getDoctorById(doctorId: number): Promise<Doctor> {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const doctor = mockDoctors.find(d => d.id === doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      return {
        ...doctor,
        qualifications: [doctor.qualifications],
        education: [{
          degree: 'MD',
          institution: 'Medical School',
          year: 2010
        }],
        about: doctor.bio
      };
    }
    
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  }

  /**
   * Get doctors by specialization
   */
  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDoctors
        .filter(doctor => doctor.specialization.toLowerCase() === specialization.toLowerCase())
        .map(doctor => ({
          ...doctor,
          qualifications: [doctor.qualifications],
          education: [{
            degree: 'MD',
            institution: 'Medical School',
            year: 2010
          }],
          about: doctor.bio
        }));
    }
    
    try {
      const response = await api.get(`/doctors/specialization/${specialization}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors by specialization:', error);
      throw error;
    }
  }

  /**
   * Search doctors by name or specialization
   */
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      const response: AxiosResponse<Doctor[]> = await api.get('/api/doctors/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching doctors:', error);
      throw error;
    }
  }

  /**
   * Get doctor's schedule
   */
  async getDoctorSchedule(doctorId: number): Promise<DoctorSchedule> {
    try {
      const response: AxiosResponse<DoctorSchedule> = await api.get(`/api/doctors/${doctorId}/schedule`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule for doctor ${doctorId}:`, error);
      throw error;
    }
  }

  /**
   * Get doctor reviews
   */
  async getDoctorReviews(doctorId: number): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await api.get(`/api/doctors/${doctorId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for doctor ${doctorId}:`, error);
      throw error;
    }
  }

  /**
   * Get top-rated doctors
   */
  async getTopRatedDoctors(limit: number = 5): Promise<Doctor[]> {
    try {
      const response: AxiosResponse<Doctor[]> = await api.get('/api/doctors/top-rated', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top-rated doctors:', error);
      throw error;
    }
  }
}

export const doctorService = new DoctorService();
export default doctorService; 