import api from './api';
import { Doctor } from '../types/doctor';

// Development mode with mock data
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

class DoctorApiService {
  async getAllDoctors(): Promise<Doctor[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDoctors;
    }
    
    const response = await api.get('/api/doctors');
    return response.data.data;
  }

  async getDoctorById(id: number): Promise<Doctor> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const doctor = mockDoctors.find(doctor => doctor.id === id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      return doctor;
    }
    
    const response = await api.get(`/api/doctors/${id}`);
    return response.data.data;
  }

  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockDoctors.filter(
        doctor => doctor.specialization.toLowerCase() === specialization.toLowerCase()
      );
    }
    
    const response = await api.get(`/api/doctors/specialization/${specialization}`);
    return response.data.data;
  }

  async getDoctorAvailability(doctorId: number, date: string) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const doctor = mockDoctors.find(doctor => doctor.id === doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      // Convert date to day of week
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
      const availability = doctor.availability[dayOfWeek as keyof typeof doctor.availability];
      
      if (!availability) {
        return []; // No availability on this day
      }
      
      // Generate time slots based on availability
      const startTime = parseInt(availability.start.split(':')[0]);
      const endTime = parseInt(availability.end.split(':')[0]);
      
      const slots = [];
      for (let hour = startTime; hour < endTime; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startDateTime = new Date(date);
          startDateTime.setHours(hour, minute, 0, 0);
          
          const endDateTime = new Date(date);
          endDateTime.setHours(hour, minute + 30, 0, 0);
          
          slots.push({
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            isAvailable: Math.random() > 0.3, // 70% chance of being available
          });
        }
      }
      
      return slots;
    }
    
    const response = await api.get(`/api/doctors/${doctorId}/availability`, {
      params: { date }
    });
    return response.data.data;
  }
}

export const doctorApi = new DoctorApiService(); 