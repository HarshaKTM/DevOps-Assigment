import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { medicalRecordsApi } from '../../services/medicalRecordsService';
import { MedicalRecord } from '../../types/medicalRecord';

interface MedicalRecordState {
  records: MedicalRecord[];
  recordsByType: Record<string, MedicalRecord[]>;
  recentRecords: MedicalRecord[];
  currentRecord: MedicalRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: MedicalRecordState = {
  records: [],
  recordsByType: {},
  recentRecords: [],
  currentRecord: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPatientRecords = createAsyncThunk(
  'medicalRecord/fetchAll',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const records = await medicalRecordsApi.getPatientRecords(patientId);
      return records;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch medical records');
    }
  }
);

export const fetchRecordById = createAsyncThunk(
  'medicalRecord/fetchById',
  async (recordId: number, { rejectWithValue }) => {
    try {
      const record = await medicalRecordsApi.getRecordById(recordId);
      return record;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch medical record details');
    }
  }
);

export const fetchRecordsByType = createAsyncThunk(
  'medicalRecord/fetchByType',
  async ({ patientId, recordType }: { patientId: number; recordType: string }, { rejectWithValue }) => {
    try {
      const records = await medicalRecordsApi.getRecordsByType(patientId, recordType);
      return { recordType, records };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch records by type');
    }
  }
);

export const fetchRecentRecords = createAsyncThunk(
  'medicalRecord/fetchRecent',
  async ({ patientId, limit }: { patientId: number; limit?: number }, { rejectWithValue }) => {
    try {
      const records = await medicalRecordsApi.getRecentRecords(patientId, limit);
      return records;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch recent records');
    }
  }
);

export const downloadAttachment = createAsyncThunk(
  'medicalRecord/downloadAttachment',
  async (
    { recordId, attachmentId }: { recordId: number; attachmentId: number },
    { rejectWithValue }
  ) => {
    try {
      const blob = await medicalRecordsApi.downloadAttachment(recordId, attachmentId);
      return { recordId, attachmentId, blob };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to download attachment');
    }
  }
);

const medicalRecordSlice = createSlice({
  name: 'medicalRecord',
  initialState,
  reducers: {
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Medical Records
    builder
      .addCase(fetchPatientRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientRecords.fulfilled, (state, action: PayloadAction<MedicalRecord[]>) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchPatientRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Medical Record by ID
    builder
      .addCase(fetchRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordById.fulfilled, (state, action: PayloadAction<MedicalRecord>) => {
        state.loading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Medical Records by Type
    builder
      .addCase(fetchRecordsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordsByType.fulfilled, (state, action) => {
        state.loading = false;
        const { recordType, records } = action.payload;
        state.recordsByType = {
          ...state.recordsByType,
          [recordType]: records,
        };
      })
      .addCase(fetchRecordsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Recent Medical Records
    builder
      .addCase(fetchRecentRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentRecords.fulfilled, (state, action: PayloadAction<MedicalRecord[]>) => {
        state.loading = false;
        state.recentRecords = action.payload;
      })
      .addCase(fetchRecentRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRecord, clearError } = medicalRecordSlice.actions;

export default medicalRecordSlice.reducer; 