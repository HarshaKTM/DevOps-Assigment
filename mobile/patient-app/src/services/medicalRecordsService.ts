import api from './api';
import { MedicalRecord, Attachment } from '../types/medicalRecord';

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

class MedicalRecordsApiService {
  async getPatientRecords(patientId: number): Promise<MedicalRecord[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return mockMedicalRecords.filter(record => record.patientId === patientId);
    }
    
    const response = await api.get(`/api/medical-records/patient/${patientId}`);
    return response.data.data;
  }

  async getRecordById(recordId: number): Promise<MedicalRecord> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const record = mockMedicalRecords.find(record => record.id === recordId);
      if (!record) {
        throw new Error('Medical record not found');
      }
      
      return record;
    }
    
    const response = await api.get(`/api/medical-records/${recordId}`);
    return response.data.data;
  }

  async getRecordsByType(patientId: number, recordType: string): Promise<MedicalRecord[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 550));
      
      return mockMedicalRecords.filter(
        record => record.patientId === patientId && record.recordType === recordType
      );
    }
    
    const response = await api.get(`/api/medical-records/patient/${patientId}/type/${recordType}`);
    return response.data.data;
  }

  async getRecentRecords(patientId: number, limit: number = 5): Promise<MedicalRecord[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockMedicalRecords
        .filter(record => record.patientId === patientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
    
    const response = await api.get(`/api/medical-records/patient/${patientId}/recent`, {
      params: { limit }
    });
    return response.data.data;
  }

  async downloadAttachment(recordId: number, attachmentId: number): Promise<Blob> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for development (just returns a small text blob)
      return new Blob(['Mock attachment content'], { type: 'text/plain' });
    }
    
    const response = await api.get(
      `/api/medical-records/${recordId}/attachments/${attachmentId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  }
}

export const medicalRecordsApi = new MedicalRecordsApiService(); 