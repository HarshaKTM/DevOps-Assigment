import api from './api';
import { AxiosResponse } from 'axios';

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
    try {
      const response: AxiosResponse<Patient> = await api.get(`/api/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient profile ${patientId}:`, error);
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
    try {
      const response: AxiosResponse<Patient> = await api.put(`/api/patients/${patientId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient profile ${patientId}:`, error);
      throw error;
    }
  }

  /**
   * Update a patient's medical history
   */
  async updateMedicalHistory(patientId: number, medicalHistoryData: Partial<Patient['medicalHistory']>): Promise<Patient> {
    try {
      const response: AxiosResponse<Patient> = await api.put(
        `/api/patients/${patientId}/medical-history`, 
        medicalHistoryData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating medical history for patient ${patientId}:`, error);
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