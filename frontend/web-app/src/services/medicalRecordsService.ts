import api from './api';

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
  async getPatientRecords(patientId: number) {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return mockMedicalRecords.filter(record => record.patientId === patientId);
    }
    
    const response = await api.get(`/api/medical-records/patient/${patientId}`);
    return response.data.data;
  }

  async getRecordById(recordId: number) {
    if (isDevEnvironment) {
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

  async createRecord(recordData: any) {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRecord = {
        id: Math.max(...mockMedicalRecords.map(record => record.id)) + 1,
        patientId: recordData.patientId,
        title: recordData.title,
        recordType: recordData.recordType,
        date: recordData.date || new Date().toISOString(),
        doctorId: recordData.doctorId,
        doctorName: recordData.doctorName,
        content: recordData.content,
        attachments: recordData.attachments || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockMedicalRecords.push(newRecord);
      return newRecord;
    }
    
    const response = await api.post('/api/medical-records', recordData);
    return response.data.data;
  }

  async updateRecord(recordId: number, recordData: any) {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const recordIndex = mockMedicalRecords.findIndex(record => record.id === recordId);
      if (recordIndex === -1) {
        throw new Error('Medical record not found');
      }
      
      const updatedRecord = {
        ...mockMedicalRecords[recordIndex],
        ...recordData,
        updatedAt: new Date().toISOString()
      };
      
      mockMedicalRecords[recordIndex] = updatedRecord;
      return updatedRecord;
    }
    
    const response = await api.put(`/api/medical-records/${recordId}`, recordData);
    return response.data.data;
  }

  async deleteRecord(recordId: number) {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const recordIndex = mockMedicalRecords.findIndex(record => record.id === recordId);
      if (recordIndex === -1) {
        throw new Error('Medical record not found');
      }
      
      mockMedicalRecords.splice(recordIndex, 1);
      return { success: true };
    }
    
    const response = await api.delete(`/api/medical-records/${recordId}`);
    return response.data;
  }

  async uploadAttachment(recordId: number, file: File) {
    if (isDevEnvironment) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const recordIndex = mockMedicalRecords.findIndex(record => record.id === recordId);
      if (recordIndex === -1) {
        throw new Error('Medical record not found');
      }
      
      const newAttachment = {
        id: Math.max(...mockMedicalRecords[recordIndex].attachments.map(att => att.id), 0) + 1,
        name: file.name,
        url: '#',
        type: file.type,
        size: file.size
      };
      
      mockMedicalRecords[recordIndex].attachments.push(newAttachment);
      return newAttachment;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/api/medical-records/${recordId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.data;
  }
}

export const medicalRecordsApi = new MedicalRecordsApiService(); 