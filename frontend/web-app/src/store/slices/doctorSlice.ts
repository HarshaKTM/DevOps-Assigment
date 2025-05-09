import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Doctor } from '../../services/doctorService';

// Create a mock service for development since we don't have the actual service
const mockDoctorApi = {
  getAllDoctors: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        specialization: 'Cardiology',
        yearsOfExperience: 12,
        about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience.',
        education: 'MD from Harvard Medical School',
        avatar: 'https://i.pravatar.cc/150?u=doctor1',
      },
      {
        id: 2,
        firstName: 'Michael',
        lastName: 'Lee',
        email: 'michael.lee@example.com',
        specialization: 'Neurology',
        yearsOfExperience: 15,
        about: 'Dr. Michael Lee is a renowned neurologist specializing in treating complex neurological disorders.',
        education: 'MD from Johns Hopkins University',
        avatar: 'https://i.pravatar.cc/150?u=doctor2',
      },
      {
        id: 3,
        firstName: 'Anna',
        lastName: 'Garcia',
        email: 'anna.garcia@example.com',
        specialization: 'Pediatrics',
        yearsOfExperience: 8,
        about: 'Dr. Anna Garcia is a caring pediatrician dedicated to children's health and wellbeing.',
        education: 'MD from University of California',
        avatar: 'https://i.pravatar.cc/150?u=doctor3',
      },
      {
        id: 4,
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.wilson@example.com',
        specialization: 'Dermatology',
        yearsOfExperience: 10,
        about: 'Dr. James Wilson is a dermatologist focused on skin health and cosmetic procedures.',
        education: 'MD from Yale University',
        avatar: 'https://i.pravatar.cc/150?u=doctor4',
      },
      {
        id: 5,
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.chen@example.com',
        specialization: 'Psychiatry',
        yearsOfExperience: 11,
        about: 'Dr. Emily Chen is a psychiatrist who combines medication management with therapy approaches.',
        education: 'MD from Stanford University',
        avatar: 'https://i.pravatar.cc/150?u=doctor5',
      },
      {
        id: 6,
        firstName: 'David',
        lastName: 'Rodriguez',
        email: 'david.rodriguez@example.com',
        specialization: 'Orthopedics',
        yearsOfExperience: 14,
        about: 'Dr. David Rodriguez is an orthopedic surgeon specializing in sports medicine and joint replacements.',
        education: 'MD from Columbia University',
        avatar: 'https://i.pravatar.cc/150?u=doctor6',
      },
      {
        id: 7,
        firstName: 'Lisa',
        lastName: 'Taylor',
        email: 'lisa.taylor@example.com',
        specialization: 'General Medicine',
        yearsOfExperience: 9,
        about: 'Dr. Lisa Taylor is a family physician committed to providing comprehensive primary care.',
        education: 'MD from University of Pennsylvania',
        avatar: 'https://i.pravatar.cc/150?u=doctor7',
      },
    ];
  },
  getDoctorById: async (doctorId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const doctors = await mockDoctorApi.getAllDoctors();
    return doctors.find(doctor => doctor.id === doctorId) || null;
  },
  getDoctorsBySpecialization: async (specialization: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const doctors = await mockDoctorApi.getAllDoctors();
    return doctors.filter(doctor => doctor.specialization === specialization);
  }
};

// Interface for the doctor state
interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  doctorsBySpecialization: {
    [key: string]: Doctor[];
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  doctorsBySpecialization: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllDoctors = createAsyncThunk(
  'doctor/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const doctors = await mockDoctorApi.getAllDoctors();
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
      const doctor = await mockDoctorApi.getDoctorById(doctorId);
      if (!doctor) {
        return rejectWithValue('Doctor not found');
      }
      return doctor;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctor');
    }
  }
);

export const fetchDoctorsBySpecialization = createAsyncThunk(
  'doctor/fetchBySpecialization',
  async (specialization: string, { rejectWithValue }) => {
    try {
      const doctors = await mockDoctorApi.getDoctorsBySpecialization(specialization);
      return { specialization, doctors };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctors by specialization');
    }
  }
);

// Doctor slice
const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
    clearDoctorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all doctors
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
        state.doctors = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.selectedDoctor = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch doctors by specialization
      .addCase(fetchDoctorsBySpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsBySpecialization.fulfilled, (state, action: PayloadAction<{
        specialization: string;
        doctors: Doctor[];
      }>) => {
        const { specialization, doctors } = action.payload;
        state.doctorsBySpecialization[specialization] = doctors;
        state.loading = false;
      })
      .addCase(fetchDoctorsBySpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedDoctor, clearDoctorError } = doctorSlice.actions;

export const selectAllDoctors = (state: RootState) => state.doctor.doctors;
export const selectSelectedDoctor = (state: RootState) => state.doctor.selectedDoctor;
export const selectDoctorsBySpecialization = (state: RootState) => state.doctor.doctorsBySpecialization;
export const selectDoctorLoading = (state: RootState) => state.doctor.loading;
export const selectDoctorError = (state: RootState) => state.doctor.error;

export default doctorSlice.reducer; 