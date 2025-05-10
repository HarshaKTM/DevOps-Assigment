import { api } from './api';
import { AxiosResponse } from 'axios';
import { MedicalRecord } from '../store/slices/medicalRecordSlice';

// Environment check for using mock data
const isDevEnvironment = process.env.NODE_ENV === 'development';

// Mock medical records
export const mockMedicalRecords: MedicalRecord[] = [];

// ... existing code ...

export const fetchPatientMedicalRecords = async (patientId: number): Promise<MedicalRecord[]> => {
  if (isDevEnvironment) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMedicalRecords.filter(record => record.patientId === patientId);
  }
  
  try {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient medical records:', error);
    throw error;
  }
};

export const createMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> => {
  if (isDevEnvironment) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRecord: MedicalRecord = {
      ...record,
      id: Math.max(...mockMedicalRecords.map(r => r.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockMedicalRecords.push(newRecord);
    return newRecord;
  }
  
  try {
    const response = await api.post('/medical-records', record);
    return response.data;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
};

export const updateMedicalRecord = async (recordId: number, updates: Partial<MedicalRecord>): Promise<MedicalRecord> => {
  if (isDevEnvironment) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const recordIndex = mockMedicalRecords.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error('Medical record not found');
    }
    const updatedRecord = {
      ...mockMedicalRecords[recordIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    mockMedicalRecords[recordIndex] = updatedRecord;
    return updatedRecord;
  }
  
  try {
    const response = await api.put(`/medical-records/${recordId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
}; 