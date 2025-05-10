import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  qualifications: string[];
  yearsOfExperience: number;
  about: string;
  education: { degree: string; institution: string; year: number; }[];
  avatar?: string;
  isActive?: boolean;
  bio?: string;
  availability?: { [key: string]: string[] };
}

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  doctorsBySpecialization: Record<string, Doctor[]>;
}

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  loading: false,
  error: null,
  doctorsBySpecialization: {},
};

export const fetchDoctors = createAsyncThunk(
  'doctor/fetchDoctors',
  async () => {
    const response = await api.get('/doctors');
    return response.data;
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctor/fetchDoctorById',
  async (id: number) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  }
);

export const fetchDoctorsBySpecialization = createAsyncThunk(
  'doctor/fetchDoctorsBySpecialization',
  async (specialization: string) => {
    const response = await api.get(`/doctors/specialization/${specialization}`);
    return response.data;
  }
);

export const createDoctor = createAsyncThunk(
  'doctor/createDoctor',
  async (doctorData: Omit<Doctor, 'id'>) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  }
);

export const updateDoctor = createAsyncThunk(
  'doctor/updateDoctor',
  async ({ id, ...doctorData }: Doctor) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  }
);

export const deleteDoctor = createAsyncThunk(
  'doctor/deleteDoctor',
  async (id: number) => {
    await api.delete(`/doctors/${id}`);
    return id;
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      })
      // Fetch Doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctor';
      })
      // Fetch Doctors by Specialization
      .addCase(fetchDoctorsBySpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsBySpecialization.fulfilled, (state, action: PayloadAction<Doctor[], string, { arg: string }>) => {
        state.loading = false;
        state.doctorsBySpecialization[action.meta.arg] = action.payload;
      })
      .addCase(fetchDoctorsBySpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors by specialization';
      })
      // Create Doctor
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.loading = false;
        state.doctors.push(action.payload);
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create doctor';
      })
      // Update Doctor
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.loading = false;
        const index = state.doctors.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload;
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update doctor';
      })
      // Delete Doctor
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.doctors = state.doctors.filter((d) => d.id !== action.payload);
        if (state.selectedDoctor?.id === action.payload) {
          state.selectedDoctor = null;
        }
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete doctor';
      });
  },
});

export const { clearDoctorError, clearSelectedDoctor } = doctorSlice.actions;

export const selectDoctors = (state: { doctor: DoctorState }) => state.doctor.doctors;
export const selectSelectedDoctor = (state: { doctor: DoctorState }) => state.doctor.selectedDoctor;
export const selectDoctorsBySpecialization = (state: { doctor: DoctorState }) => state.doctor.doctorsBySpecialization;
export const selectLoading = (state: { doctor: DoctorState }) => state.doctor.loading;
export const selectError = (state: { doctor: DoctorState }) => state.doctor.error;

export default doctorSlice.reducer; 