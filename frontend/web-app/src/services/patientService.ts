import { api } from './api';
import { AxiosResponse } from 'axios';
import { Patient } from '../store/slices/patientSlice';

// Environment check for using mock data
const isDevEnvironment = process.env.NODE_ENV === 'development';

// Mock patient data for development
const mockPatients: Patient[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '555-123-4567',
    dateOfBirth: '1980-05-15',
    gender: 'male',
    address: '123 Main St, Anytown, USA',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    allergies: 'Penicillin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '555-987-6543',
    dateOfBirth: '1992-08-21',
    gender: 'female',
    address: '456 Oak Ave, Somecity, USA',
    medicalHistory: 'Asthma',
    allergies: 'Sulfa drugs, Peanuts',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phoneNumber: '555-567-8901',
    dateOfBirth: '1975-11-03',
    gender: 'male',
    address: '789 Pine St, Anothercity, USA',
    medicalHistory: 'Heart disease, High cholesterol',
    allergies: 'None',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

export interface Patient {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phoneNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalHistory: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    surgeries: string[];
    familyHistory: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    primaryInsured: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phoneNumber: string;
}

class PatientService {
  /**
   * Get a patient profile by ID
   */
  async getPatientProfile(patientId: number): Promise<Patient> {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const patient = mockPatients.find(p => p.id === patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return {
        ...patient,
        dateOfBirth: new Date(patient.dateOfBirth).toISOString(),
        medicalHistory: patient.medicalHistory || [],
        allergies: patient.allergies || [],
        medications: patient.medications || []
      };
    }
    
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      throw error;
    }
  }

  /**
   * Search patients by name, email, or ID
   */
  async searchPatients(query: string): Promise<Patient[]> {
    try {
      const response: AxiosResponse<Patient[]> = await api.get('/api/patients/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }

  /**
   * Update a patient's profile information
   */
  async updateProfile(patientId: number, profileData: Partial<PatientProfile>): Promise<Patient> {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const patient = mockPatients.find(p => p.id === patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return {
        ...patient,
        ...profileData,
        dateOfBirth: profileData.dateOfBirth || patient.dateOfBirth,
        medicalHistory: profileData.medicalHistory || patient.medicalHistory || [],
        allergies: profileData.allergies || patient.allergies || [],
        medications: profileData.medications || patient.medications || []
      };
    }
    
    try {
      const response = await api.put(`/patients/${patientId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating patient profile:', error);
      throw error;
    }
  }

  /**
   * Update a patient's medical history
   */
  async updateMedicalHistory(patientId: number, medicalHistoryData: Partial<Patient['medicalHistory']>): Promise<Patient> {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const patient = mockPatients.find(p => p.id === patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return {
        ...patient,
        medicalHistory: medicalHistoryData || patient.medicalHistory || []
      };
    }
    
    try {
      const response = await api.put(`/patients/${patientId}/medical-history`, medicalHistoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating patient medical history:', error);
      throw error;
    }
  }

  /**
   * Update a patient's insurance information
   */
  async updateInsurance(patientId: number, insuranceData: Partial<Patient['insurance']>): Promise<Patient> {
    try {
      const response: AxiosResponse<Patient> = await api.put(
        `/api/patients/${patientId}/insurance`, 
        insuranceData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating insurance for patient ${patientId}:`, error);
      throw error;
    }
  }

  /**
   * Update a patient's emergency contact
   */
  async updateEmergencyContact(patientId: number, contactData: Partial<Patient['emergencyContact']>): Promise<Patient> {
    try {
      const response: AxiosResponse<Patient> = await api.put(
        `/api/patients/${patientId}/emergency-contact`, 
        contactData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating emergency contact for patient ${patientId}:`, error);
      throw error;
    }
  }

  /**
   * Get a list of patients for a specific doctor
   */
  async getDoctorPatients(doctorId: number): Promise<Patient[]> {
    try {
      const response: AxiosResponse<Patient[]> = await api.get(`/api/patients/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patients for doctor ${doctorId}:`, error);
      throw error;
    }
  }

  /**
   * Add a new patient (for admin use)
   */
  async addPatient(patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response: AxiosResponse<Patient> = await api.post('/api/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Error adding new patient:', error);
      throw error;
    }
  }
}

export const patientService = new PatientService();
export default patientService; 