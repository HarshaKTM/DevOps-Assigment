import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  recordType: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  date: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface MedicalRecordState {
  records: MedicalRecord[];
  selectedRecord: MedicalRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: MedicalRecordState = {
  records: [],
  selectedRecord: null,
  loading: false,
  error: null,
};

export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecord/fetchMedicalRecords',
  async () => {
    const response = await api.get('/medical-records');
    return response.data;
  }
);

export const fetchMedicalRecordById = createAsyncThunk(
  'medicalRecord/fetchMedicalRecordById',
  async (id: number) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  }
);

export const createMedicalRecord = createAsyncThunk(
  'medicalRecord/createMedicalRecord',
  async (recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  }
);

export const updateMedicalRecord = createAsyncThunk(
  'medicalRecord/updateMedicalRecord',
  async ({ id, ...recordData }: MedicalRecord) => {
    const response = await api.put(`/medical-records/${id}`, recordData);
    return response.data;
  }
);

export const deleteMedicalRecord = createAsyncThunk(
  'medicalRecord/deleteMedicalRecord',
  async (id: number) => {
    await api.delete(`/medical-records/${id}`);
    return id;
  }
);

export const fetchPatientMedicalRecords = createAsyncThunk(
  'medicalRecord/fetchPatientMedicalRecords',
  async (patientId: number) => {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  }
);

const medicalRecordSlice = createSlice({
  name: 'medicalRecord',
  initialState,
  reducers: {
    clearMedicalRecordError: (state) => {
      state.error = null;
    },
    clearSelectedMedicalRecord: (state) => {
      state.selectedRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Medical Records
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action: PayloadAction<MedicalRecord[]>) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medical records';
      })
      // Fetch Medical Record by ID
      .addCase(fetchMedicalRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecordById.fulfilled, (state, action: PayloadAction<MedicalRecord>) => {
        state.loading = false;
        state.selectedRecord = action.payload;
      })
      .addCase(fetchMedicalRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medical record';
      })
      // Create Medical Record
      .addCase(createMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action: PayloadAction<MedicalRecord>) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(createMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create medical record';
      })
      // Update Medical Record
      .addCase(updateMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicalRecord.fulfilled, (state, action: PayloadAction<MedicalRecord>) => {
        state.loading = false;
        const index = state.records.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
        if (state.selectedRecord?.id === action.payload.id) {
          state.selectedRecord = action.payload;
        }
      })
      .addCase(updateMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update medical record';
      })
      // Delete Medical Record
      .addCase(deleteMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedicalRecord.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.records = state.records.filter((r) => r.id !== action.payload);
        if (state.selectedRecord?.id === action.payload) {
          state.selectedRecord = null;
        }
      })
      .addCase(deleteMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete medical record';
      });
  },
});

export const { clearMedicalRecordError, clearSelectedMedicalRecord } = medicalRecordSlice.actions;

export const selectAllRecords = (state: { medicalRecord: MedicalRecordState }) => state.medicalRecord.records;
export const selectCurrentRecord = (state: { medicalRecord: MedicalRecordState }) => state.medicalRecord.selectedRecord;
export const selectMedicalRecordsLoading = (state: { medicalRecord: MedicalRecordState }) => state.medicalRecord.loading;
export const selectMedicalRecordsError = (state: { medicalRecord: MedicalRecordState }) => state.medicalRecord.error;

export default medicalRecordSlice.reducer; 