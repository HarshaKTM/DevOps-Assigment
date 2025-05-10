import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    firstName: string;
    lastName: string;
  };
}

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  availableTimeSlots: string[];
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  upcomingAppointments: [],
  pastAppointments: [],
  availableTimeSlots: [],
};

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async () => {
    const response = await api.get('/appointments');
    return response.data;
  }
);

export const fetchPatientAppointments = createAsyncThunk(
  'appointment/fetchPatientAppointments',
  async (patientId: number) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointment/fetchAppointmentById',
  async (id: number) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  }
);

export const createAppointment = createAsyncThunk(
  'appointment/createAppointment',
  async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  }
);

export const updateAppointment = createAsyncThunk(
  'appointment/updateAppointment',
  async ({ id, ...appointmentData }: Appointment) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointment/deleteAppointment',
  async (id: number) => {
    await api.delete(`/appointments/${id}`);
    return id;
  }
);

export const fetchUpcomingAppointments = createAsyncThunk(
  'appointment/fetchUpcomingAppointments',
  async (patientId: number) => {
    const response = await api.get(`/appointments/patient/${patientId}/upcoming`);
    return response.data;
  }
);

export const fetchPastAppointments = createAsyncThunk(
  'appointment/fetchPastAppointments',
  async (patientId: number) => {
    const response = await api.get(`/appointments/patient/${patientId}/past`);
    return response.data;
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'appointment/fetchTimeSlots',
  async ({ doctorId, date }: { doctorId: number; date: string }) => {
    const response = await api.get(`/appointments/time-slots/${doctorId}?date=${date}`);
    return response.data;
  }
);

export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointment/cancelAppointment',
  async (id: number) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      // Fetch Patient Appointments
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patient appointments';
      })
      // Fetch Appointment by ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.selectedAppointment = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointment';
      })
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create appointment';
      })
      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        const index = state.appointments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update appointment';
      })
      // Delete Appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.appointments = state.appointments.filter((a) => a.id !== action.payload);
        if (state.selectedAppointment?.id === action.payload) {
          state.selectedAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete appointment';
      })
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
        state.upcomingAppointments = action.payload;
      })
      .addCase(fetchPastAppointments.fulfilled, (state, action) => {
        state.pastAppointments = action.payload;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.availableTimeSlots = action.payload;
      });
  },
});

export const { clearAppointmentError, clearSelectedAppointment } = appointmentSlice.actions;

export const selectAllAppointments = (state: { appointment: AppointmentState }) => state.appointment.appointments;
export const selectSelectedAppointment = (state: { appointment: AppointmentState }) => state.appointment.selectedAppointment;
export const selectAppointmentLoading = (state: { appointment: AppointmentState }) => state.appointment.loading;
export const selectAppointmentError = (state: { appointment: AppointmentState }) => state.appointment.error;

export default appointmentSlice.reducer; 