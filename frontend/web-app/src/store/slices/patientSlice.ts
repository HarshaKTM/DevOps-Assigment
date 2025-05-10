import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalHistory?: string;
  allergies?: string;
  avatar?: string;
  medications?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    primaryInsured: string;
  };
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
};

export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async () => {
    const response = await api.get('/patients');
    return response.data;
  }
);

export const fetchPatientById = createAsyncThunk(
  'patient/fetchPatientById',
  async (id: number) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  }
);

export const createPatient = createAsyncThunk(
  'patient/createPatient',
  async (patientData: Omit<Patient, 'id'>) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  }
);

export const updatePatient = createAsyncThunk(
  'patient/updatePatient',
  async ({ id, ...patientData }: Patient) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  }
);

export const deletePatient = createAsyncThunk(
  'patient/deletePatient',
  async (id: number) => {
    await api.delete(`/patients/${id}`);
    return id;
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearPatientError: (state) => {
      state.error = null;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      })
      // Fetch Patient by ID
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patient';
      })
      // Create Patient
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create patient';
      })
      // Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        const index = state.patients.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update patient';
      })
      // Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.patients = state.patients.filter((p) => p.id !== action.payload);
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete patient';
      });
  },
});

export const { clearPatientError, clearSelectedPatient } = patientSlice.actions;

export const selectAllPatients = (state: { patient: PatientState }) => state.patient.patients;
export const selectSelectedPatient = (state: { patient: PatientState }) => state.patient.selectedPatient;
export const selectPatientLoading = (state: { patient: PatientState }) => state.patient.loading;
export const selectPatientError = (state: { patient: PatientState }) => state.patient.error;

export default patientSlice.reducer; 