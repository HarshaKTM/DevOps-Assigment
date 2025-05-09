import api from './api';
import { AxiosResponse } from 'axios';
import { MedicalRecord } from '../store/slices/medicalRecordsSlice';

// Development mode with mock data
const isDevEnvironment = true;

// Mock medical records
const mockMedicalRecords = [
  {
    id: 1001,
    patientId: 101,
    title: 'Annual Physical Examination',
    recordType: 'examination',
    date: '2023-05-15T10:30:00.000Z',
    doctorId: 204,
    doctorName: 'Dr. James Wilson',
    content: 'Patient is in good health. Blood pressure: 120/80 mmHg. Heart rate: 72 bpm. Weight: 70kg. Height: 175cm.',
    attachments: [
      { id: 1, name: 'blood_test_results.pdf', url: '#', type: 'application/pdf', size: 1024 * 1024 * 2.1 }
    ],
    createdAt: '2023-05-15T11:00:00.000Z',
    updatedAt: '2023-05-15T11:00:00.000Z'
  },
  {
    id: 1002,
    patientId: 101,
    title: 'COVID-19 Vaccination',
    recordType: 'vaccination',
    date: '2023-02-10T14:15:00.000Z',
    doctorId: 204,
    doctorName: 'Dr. James Wilson',
    content: 'Patient received second dose of Pfizer-BioNTech COVID-19 vaccine. No immediate adverse reactions.',
    attachments: [
      { id: 2, name: 'vaccination_certificate.pdf', url: '#', type: 'application/pdf', size: 1024 * 512 }
    ],
    createdAt: '2023-02-10T14:45:00.000Z',
    updatedAt: '2023-02-10T14:45:00.000Z'
  },
  {
    id: 1003,
    patientId: 101,
    title: 'Cardiologist Consultation',
    recordType: 'consultation',
    date: '2023-04-05T09:00:00.000Z',
    doctorId: 201,
    doctorName: 'Dr. Sarah Johnson',
    content: 'Patient came in for routine heart check-up. ECG results normal. Recommended maintaining current medication and follow-up in 6 months.',
    attachments: [
      { id: 3, name: 'ecg_results.jpg', url: '#', type: 'image/jpeg', size: 1024 * 768 * 3 },
      { id: 4, name: 'cardio_report.pdf', url: '#', type: 'application/pdf', size: 1024 * 1024 * 1.5 }
    ],
    createdAt: '2023-04-05T09:45:00.000Z',
    updatedAt: '2023-04-05T09:45:00.000Z'
  },
  {
    id: 1004,
    patientId: 101,
    title: 'Prescription Renewal',
    recordType: 'prescription',
    date: '2023-06-20T15:30:00.000Z',
    doctorId: 204,
    doctorName: 'Dr. James Wilson',
    content: 'Renewed prescription for hypertension medication (Lisinopril 10mg, once daily). 3-month supply.',
    attachments: [],
    createdAt: '2023-06-20T15:45:00.000Z',
    updatedAt: '2023-06-20T15:45:00.000Z'
  }
];

class MedicalRecordsService {
  /**
   * Get all medical records for a patient
   */
  async getPatientRecords(patientId: number): Promise<MedicalRecord[]> {
    try {
      const response: AxiosResponse<MedicalRecord[]> = await api.get(`/api/medical-records/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient medical records:', error);
      throw error;
    }
  }

  /**
   * Get a specific medical record by ID
   */
  async getRecordById(recordId: number): Promise<MedicalRecord> {
    try {
      const response: AxiosResponse<MedicalRecord> = await api.get(`/api/medical-records/${recordId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Get medical records by type
   */
  async getRecordsByType(patientId: number, recordType: string): Promise<MedicalRecord[]> {
    try {
      const response: AxiosResponse<MedicalRecord[]> = await api.get(
        `/api/medical-records/patient/${patientId}/type/${recordType}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical records by type ${recordType}:`, error);
      throw error;
    }
  }

  /**
   * Upload a new medical record
   */
  async uploadRecord(recordData: FormData): Promise<MedicalRecord> {
    try {
      const response: AxiosResponse<MedicalRecord> = await api.post('/api/medical-records', recordData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading medical record:', error);
      throw error;
    }
  }

  /**
   * Update a medical record
   */
  async updateRecord(recordId: number, recordData: Partial<MedicalRecord>): Promise<MedicalRecord> {
    try {
      const response: AxiosResponse<MedicalRecord> = await api.put(`/api/medical-records/${recordId}`, recordData);
      return response.data;
    } catch (error) {
      console.error(`Error updating medical record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a medical record
   */
  async deleteRecord(recordId: number): Promise<{ success: boolean }> {
    try {
      const response: AxiosResponse<{ success: boolean }> = await api.delete(`/api/medical-records/${recordId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting medical record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Share a medical record
   */
  async shareRecord(recordId: number, recipientId: number, permissions: string): Promise<{ success: boolean }> {
    try {
      const response: AxiosResponse<{ success: boolean }> = await api.post(`/api/medical-records/${recordId}/share`, {
        recipientId,
        permissions,
      });
      return response.data;
    } catch (error) {
      console.error(`Error sharing medical record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Download a medical record file
   */
  async downloadFile(fileUrl: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get(fileUrl, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading file ${fileUrl}:`, error);
      throw error;
    }
  }
}

export const medicalRecordsService = new MedicalRecordsService();
export default medicalRecordsService; 