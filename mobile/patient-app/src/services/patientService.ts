import api from './api';
import { Patient, PatientProfile } from '../types/patient';

// Development mode with mock data
const isDevEnvironment = true;

// Mock patient data (for development)
const mockPatient: Patient = {
  id: 101,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1985-07-15',
  gender: 'male',
  address: {
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States'
  },
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+1 (555) 987-6543'
  },
  insurance: {
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS12345678',
    groupNumber: 'GRP987654',
    primary: true
  },
  medicalHistory: {
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Hypertension'],
    currentMedications: ['Lisinopril 10mg daily'],
    pastSurgeries: [
      { procedure: 'Appendectomy', year: 2010 }
    ],
    familyHistory: {
      heartDisease: true,
      diabetes: true,
      cancer: false
    }
  },
  createdAt: '2023-01-10T08:00:00.000Z',
  updatedAt: '2023-06-15T11:30:00.000Z'
};

class PatientApiService {
  async getPatientProfile(patientId: number): Promise<Patient> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return mockPatient;
    }
    
    const response = await api.get(`/api/patients/${patientId}`);
    return response.data.data;
  }

  async updateProfile(patientId: number, profileData: Partial<PatientProfile>): Promise<Patient> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Update mock data
      const updatedPatient = {
        ...mockPatient,
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      
      return updatedPatient;
    }
    
    const response = await api.put(`/api/patients/${patientId}/profile`, profileData);
    return response.data.data;
  }

  async updateMedicalHistory(patientId: number, medicalHistoryData: Partial<Patient['medicalHistory']>): Promise<Patient> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Update mock data
      const updatedPatient = {
        ...mockPatient,
        medicalHistory: {
          ...mockPatient.medicalHistory,
          ...medicalHistoryData
        },
        updatedAt: new Date().toISOString()
      };
      
      return updatedPatient;
    }
    
    const response = await api.put(`/api/patients/${patientId}/medical-history`, medicalHistoryData);
    return response.data.data;
  }

  async updateInsurance(patientId: number, insuranceData: Partial<Patient['insurance']>): Promise<Patient> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Update mock data
      const updatedPatient = {
        ...mockPatient,
        insurance: {
          ...mockPatient.insurance,
          ...insuranceData
        },
        updatedAt: new Date().toISOString()
      };
      
      return updatedPatient;
    }
    
    const response = await api.put(`/api/patients/${patientId}/insurance`, insuranceData);
    return response.data.data;
  }

  async updateEmergencyContact(patientId: number, contactData: Partial<Patient['emergencyContact']>): Promise<Patient> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update mock data
      const updatedPatient = {
        ...mockPatient,
        emergencyContact: {
          ...mockPatient.emergencyContact,
          ...contactData
        },
        updatedAt: new Date().toISOString()
      };
      
      return updatedPatient;
    }
    
    const response = await api.put(`/api/patients/${patientId}/emergency-contact`, contactData);
    return response.data.data;
  }
}

export const patientApi = new PatientApiService(); 