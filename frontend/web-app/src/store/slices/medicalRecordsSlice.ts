import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Types
export interface MedicalRecord {
  id: number;
  patientId: number;
  recordType: 'lab_result' | 'prescription' | 'diagnosis' | 'imaging' | 'vaccination' | 'visit_summary' | 'other';
  title: string;
  description: string;
  date: string;
  performedBy: string;
  fileUrl?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Mock data generator for medical records
const generateMockMedicalRecords = (patientId: number, count: number): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const recordTypes: MedicalRecord['recordType'][] = [
    'lab_result', 'prescription', 'diagnosis', 'imaging', 'vaccination', 'visit_summary', 'other'
  ];
  
  const doctors = [
    'Dr. Sarah Johnson',
    'Dr. Michael Lee',
    'Dr. Anna Garcia',
    'Dr. James Wilson',
    'Dr. Emily Chen'
  ];
  
  for (let i = 1; i <= count; i++) {
    // Generate a date within the last 2 years
    const recordDate = new Date();
    recordDate.setDate(recordDate.getDate() - Math.floor(Math.random() * 730)); // Up to 2 years ago
    
    const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
    let title = '';
    let description = '';
    
    switch (recordType) {
      case 'lab_result':
        title = ['Complete Blood Count', 'Lipid Panel', 'Urinalysis', 'Glucose Test', 'Thyroid Panel'][Math.floor(Math.random() * 5)];
        description = `${title} test results show normal values within expected ranges.`;
        break;
      case 'prescription':
        title = ['Amoxicillin', 'Lisinopril', 'Metformin', 'Atorvastatin', 'Levothyroxine'][Math.floor(Math.random() * 5)];
        description = `Prescription for ${title} - take as directed.`;
        break;
      case 'diagnosis':
        title = ['Hypertension', 'Type 2 Diabetes', 'Sinusitis', 'Bronchitis', 'Anxiety Disorder'][Math.floor(Math.random() * 5)];
        description = `Patient diagnosed with ${title}. Treatment plan established.`;
        break;
      case 'imaging':
        title = ['Chest X-Ray', 'Abdominal Ultrasound', 'MRI Brain', 'CT Scan Chest', 'Bone Density Scan'][Math.floor(Math.random() * 5)];
        description = `${title} results show no abnormalities.`;
        break;
      case 'vaccination':
        title = ['Influenza Vaccine', 'COVID-19 Vaccine', 'Tdap Vaccine', 'Pneumococcal Vaccine', 'Shingles Vaccine'][Math.floor(Math.random() * 5)];
        description = `Patient received ${title}. No adverse reactions reported.`;
        break;
      case 'visit_summary':
        title = 'Office Visit Summary';
        description = 'Routine check-up with no significant findings.';
        break;
      case 'other':
        title = ['Medical Clearance', 'Health Certificate', 'Specialist Referral', 'Physical Therapy Plan', 'Nutrition Consultation'][Math.floor(Math.random() * 5)];
        description = `${title} completed and documented.`;
        break;
    }
    
    // Some records have attachments, others don't
    const hasAttachments = Math.random() > 0.5;
    const attachments = hasAttachments 
      ? [
          {
            name: `${recordType}_${i}.pdf`,
            url: `https://example.com/files/${recordType}_${i}.pdf`,
            type: 'application/pdf',
            size: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
          }
        ] 
      : undefined;
    
    records.push({
      id: i,
      patientId,
      recordType,
      title,
      description,
      date: recordDate.toISOString().split('T')[0],
      performedBy: doctors[Math.floor(Math.random() * doctors.length)],
      fileUrl: hasAttachments ? `https://example.com/files/${recordType}_${i}.pdf` : undefined,
      attachments,
      createdAt: new Date(recordDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day after record date
      updatedAt: new Date(recordDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  // Sort by date descending (newest first)
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock API service
const mockMedicalRecordsApi = {
  getPatientRecords: async (patientId: number): Promise<MedicalRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return generateMockMedicalRecords(patientId, 15);
  },
  
  getRecordById: async (recordId: number): Promise<MedicalRecord> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const allRecords = generateMockMedicalRecords(101, 15); // Using fixed patientId for demo
    const record = allRecords.find(r => r.id === recordId);
    
    if (!record) {
      throw new Error('Medical record not found');
    }
    
    return record;
  },
  
  getRecordsByType: async (patientId: number, recordType: MedicalRecord['recordType']): Promise<MedicalRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const allRecords = generateMockMedicalRecords(patientId, 15);
    return allRecords.filter(r => r.recordType === recordType);
  },
  
  uploadRecord: async (recordData: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Math.floor(Math.random() * 1000) + 100,
      patientId: recordData.patientId || 0,
      recordType: recordData.recordType || 'other',
      title: recordData.title || '',
      description: recordData.description || '',
      date: recordData.date || new Date().toISOString().split('T')[0],
      performedBy: recordData.performedBy || 'Doctor',
      fileUrl: recordData.fileUrl,
      attachments: recordData.attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

// State interface
interface MedicalRecordsState {
  records: MedicalRecord[];
  currentRecord: MedicalRecord | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MedicalRecordsState = {
  records: [],
  currentRecord: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPatientRecords = createAsyncThunk(
  'medicalRecords/fetchPatientRecords',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const records = await mockMedicalRecordsApi.getPatientRecords(patientId);
      return records;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch medical records');
    }
  }
);

export const fetchRecordById = createAsyncThunk(
  'medicalRecords/fetchRecordById',
  async (recordId: number, { rejectWithValue }) => {
    try {
      const record = await mockMedicalRecordsApi.getRecordById(recordId);
      return record;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch medical record');
    }
  }
);

export const fetchRecordsByType = createAsyncThunk(
  'medicalRecords/fetchRecordsByType',
  async ({ patientId, recordType }: { patientId: number; recordType: MedicalRecord['recordType'] }, { rejectWithValue }) => {
    try {
      const records = await mockMedicalRecordsApi.getRecordsByType(patientId, recordType);
      return records;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch medical records by type');
    }
  }
);

export const uploadMedicalRecord = createAsyncThunk(
  'medicalRecords/uploadRecord',
  async (recordData: Partial<MedicalRecord>, { rejectWithValue }) => {
    try {
      const record = await mockMedicalRecordsApi.uploadRecord(recordData);
      return record;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload medical record');
    }
  }
);

// Create the slice
const medicalRecordsSlice = createSlice({
  name: 'medicalRecords',
  initialState,
  reducers: {
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
    clearMedicalRecordsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch patient records
      .addCase(fetchPatientRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientRecords.fulfilled, (state, action: PayloadAction<MedicalRecord[]>) => {
        state.records = action.payload;
        state.loading = false;
      })
      .addCase(fetchPatientRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch record by ID
      .addCase(fetchRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordById.fulfilled, (state, action: PayloadAction<MedicalRecord>) => {
        state.currentRecord = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch records by type
      .addCase(fetchRecordsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordsByType.fulfilled, (state, action: PayloadAction<MedicalRecord[]>) => {
        state.records = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecordsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload medical record
      .addCase(uploadMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMedicalRecord.fulfilled, (state, action: PayloadAction<MedicalRecord>) => {
        state.records = [action.payload, ...state.records];
        state.currentRecord = action.payload;
        state.loading = false;
      })
      .addCase(uploadMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRecord, clearMedicalRecordsError } = medicalRecordsSlice.actions;

export const selectAllRecords = (state: RootState) => state.medicalRecord.records;
export const selectCurrentRecord = (state: RootState) => state.medicalRecord.selectedRecord;
export const selectMedicalRecordsLoading = (state: RootState) => state.medicalRecord.loading;
export const selectMedicalRecordsError = (state: RootState) => state.medicalRecord.error;

export default medicalRecordsSlice.reducer; 