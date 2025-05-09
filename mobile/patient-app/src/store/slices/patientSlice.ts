import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { patientApi } from '../../services/patientService';
import { Patient, PatientProfile } from '../../types/patient';

interface PatientState {
  patient: Patient | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patient: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPatientProfile = createAsyncThunk(
  'patient/fetchProfile',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const profile = await patientApi.getPatientProfile(patientId);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch patient profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'patient/updateProfile',
  async (
    { patientId, profileData }: { patientId: number; profileData: Partial<PatientProfile> },
    { rejectWithValue }
  ) => {
    try {
      const updatedProfile = await patientApi.updateProfile(patientId, profileData);
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update patient profile');
    }
  }
);

export const updateMedicalHistory = createAsyncThunk(
  'patient/updateMedicalHistory',
  async (
    { patientId, medicalHistoryData }: { patientId: number; medicalHistoryData: Partial<Patient['medicalHistory']> },
    { rejectWithValue }
  ) => {
    try {
      const updatedProfile = await patientApi.updateMedicalHistory(patientId, medicalHistoryData);
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update medical history');
    }
  }
);

export const updateInsurance = createAsyncThunk(
  'patient/updateInsurance',
  async (
    { patientId, insuranceData }: { patientId: number; insuranceData: Partial<Patient['insurance']> },
    { rejectWithValue }
  ) => {
    try {
      const updatedProfile = await patientApi.updateInsurance(patientId, insuranceData);
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update insurance information');
    }
  }
);

export const updateEmergencyContact = createAsyncThunk(
  'patient/updateEmergencyContact',
  async (
    { patientId, contactData }: { patientId: number; contactData: Partial<Patient['emergencyContact']> },
    { rejectWithValue }
  ) => {
    try {
      const updatedProfile = await patientApi.updateEmergencyContact(patientId, contactData);
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update emergency contact');
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearPatientData: (state) => {
      state.patient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Patient Profile
    builder
      .addCase(fetchPatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Patient Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Medical History
    builder
      .addCase(updateMedicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicalHistory.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(updateMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Insurance
    builder
      .addCase(updateInsurance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInsurance.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(updateInsurance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Emergency Contact
    builder
      .addCase(updateEmergencyContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmergencyContact.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(updateEmergencyContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPatientData, clearError } = patientSlice.actions;

export default patientSlice.reducer; 