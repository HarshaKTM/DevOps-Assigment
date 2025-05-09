import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentApi } from '../../services/appointmentService';
import { Appointment, TimeSlot } from '../../types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  currentAppointment: Appointment | null;
  availableTimeSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  upcomingAppointments: [],
  pastAppointments: [],
  currentAppointment: null,
  availableTimeSlots: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAll',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const appointments = await appointmentApi.getPatientAppointments(patientId);
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchUpcomingAppointments = createAsyncThunk(
  'appointment/fetchUpcoming',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const appointments = await appointmentApi.getUpcomingAppointments(patientId);
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch upcoming appointments');
    }
  }
);

export const fetchPastAppointments = createAsyncThunk(
  'appointment/fetchPast',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const appointments = await appointmentApi.getPastAppointments(patientId);
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch past appointments');
    }
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointment/fetchById',
  async (appointmentId: number, { rejectWithValue }) => {
    try {
      const appointment = await appointmentApi.getAppointmentById(appointmentId);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointment details');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointment/book',
  async (appointmentData: Partial<Appointment>, { rejectWithValue }) => {
    try {
      const appointment = await appointmentApi.createAppointment(appointmentData);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to book appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointment/update',
  async (
    { appointmentId, appointmentData }: { appointmentId: number; appointmentData: Partial<Appointment> },
    { rejectWithValue }
  ) => {
    try {
      const appointment = await appointmentApi.updateAppointment(appointmentId, appointmentData);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update appointment');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointment/cancel',
  async (appointmentId: number, { rejectWithValue }) => {
    try {
      const result = await appointmentApi.cancelAppointment(appointmentId);
      return { appointmentId, success: result.success };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel appointment');
    }
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'appointment/fetchTimeSlots',
  async ({ doctorId, date }: { doctorId: number; date: string }, { rejectWithValue }) => {
    try {
      const timeSlots = await appointmentApi.getDoctorTimeSlots(doctorId, date);
      return timeSlots;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch available time slots');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
    clearTimeSlots: (state) => {
      state.availableTimeSlots = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Appointments
    builder
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
        state.error = action.payload as string;
      });

    // Fetch Upcoming Appointments
    builder
      .addCase(fetchUpcomingAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.upcomingAppointments = action.payload;
      })
      .addCase(fetchUpcomingAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Past Appointments
    builder
      .addCase(fetchPastAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.pastAppointments = action.payload;
      })
      .addCase(fetchPastAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Appointment by ID
    builder
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.currentAppointment = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Book Appointment
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.appointments = [...state.appointments, action.payload];
        state.upcomingAppointments = [...state.upcomingAppointments, action.payload];
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Appointment
    builder
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        const updatedAppointment = action.payload;
        
        // Update in all lists
        state.appointments = state.appointments.map(appointment => 
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        );
        state.upcomingAppointments = state.upcomingAppointments.map(appointment =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        );
        state.pastAppointments = state.pastAppointments.map(appointment =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        );
        
        // Update current appointment if it's the one being viewed
        if (state.currentAppointment && state.currentAppointment.id === updatedAppointment.id) {
          state.currentAppointment = updatedAppointment;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel Appointment
    builder
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const { appointmentId } = action.payload;
        
        // Update the appointment status in all lists
        state.appointments = state.appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'cancelled', updatedAt: new Date().toISOString() }
            : appointment
        );
        
        // Remove from upcoming appointments
        state.upcomingAppointments = state.upcomingAppointments.filter(
          appointment => appointment.id !== appointmentId
        );
        
        // Add to past appointments if not already there
        const cancelledAppointment = state.appointments.find(appointment => appointment.id === appointmentId);
        if (cancelledAppointment && !state.pastAppointments.some(a => a.id === appointmentId)) {
          state.pastAppointments = [
            { ...cancelledAppointment, status: 'cancelled', updatedAt: new Date().toISOString() },
            ...state.pastAppointments
          ];
        }
        
        // Update current appointment if it's the one being cancelled
        if (state.currentAppointment && state.currentAppointment.id === appointmentId) {
          state.currentAppointment = {
            ...state.currentAppointment,
            status: 'cancelled',
            updatedAt: new Date().toISOString()
          };
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Time Slots
    builder
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action: PayloadAction<TimeSlot[]>) => {
        state.loading = false;
        state.availableTimeSlots = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentAppointment, clearTimeSlots, clearError } = appointmentSlice.actions;

export default appointmentSlice.reducer; 