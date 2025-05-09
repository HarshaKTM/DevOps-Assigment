import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doctorApi } from '../../services/doctorService';
import { Doctor } from '../../types/doctor';

interface DoctorState {
  doctors: Doctor[];
  doctorsBySpecialization: Record<string, Doctor[]>;
  currentDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  doctors: [],
  doctorsBySpecialization: {},
  currentDoctor: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllDoctors = createAsyncThunk(
  'doctor/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const doctors = await doctorApi.getAllDoctors();
      return doctors;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctor/fetchById',
  async (doctorId: number, { rejectWithValue }) => {
    try {
      const doctor = await doctorApi.getDoctorById(doctorId);
      return doctor;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctor details');
    }
  }
);

export const fetchDoctorsBySpecialization = createAsyncThunk(
  'doctor/fetchBySpecialization',
  async (specialization: string, { rejectWithValue }) => {
    try {
      const doctors = await doctorApi.getDoctorsBySpecialization(specialization);
      return { specialization, doctors };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctors by specialization');
    }
  }
);

export const fetchDoctorAvailability = createAsyncThunk(
  'doctor/fetchAvailability',
  async ({ doctorId, date }: { doctorId: number; date: string }, { rejectWithValue }) => {
    try {
      const availability = await doctorApi.getDoctorAvailability(doctorId, date);
      return { doctorId, date, availability };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctor availability');
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Doctors
    builder
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Doctor by ID
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Doctors by Specialization
    builder
      .addCase(fetchDoctorsBySpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsBySpecialization.fulfilled, (state, action) => {
        state.loading = false;
        const { specialization, doctors } = action.payload;
        state.doctorsBySpecialization = {
          ...state.doctorsBySpecialization,
          [specialization]: doctors,
        };
      })
      .addCase(fetchDoctorsBySpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentDoctor, clearError } = doctorSlice.actions;

export default doctorSlice.reducer; 