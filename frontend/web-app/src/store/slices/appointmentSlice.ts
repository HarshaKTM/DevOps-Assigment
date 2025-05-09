import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Appointment, TimeSlot, appointmentService } from '../../services/appointmentService';

// Mock appointments data
const generateMockAppointments = (patientId: number, count: number, isPast: boolean): Appointment[] => {
  const currentDate = new Date();
  const appointments: Appointment[] = [];
  
  for (let i = 1; i <= count; i++) {
    const date = new Date();
    
    if (isPast) {
      // Generate dates in the past (1-30 days ago)
      date.setDate(date.getDate() - Math.floor(Math.random() * 30) - 1);
    } else {
      // Generate dates in the future (1-30 days ahead)
      date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const startHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
    const startTime = `${startHour.toString().padStart(2, '0')}:00`;
    const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;
    
    const status = isPast 
      ? Math.random() > 0.2 
        ? 'completed' 
        : Math.random() > 0.5 
          ? 'cancelled' 
          : 'no-show'
      : 'scheduled';
    
    // List of possible appointment types
    const types = ['regular', 'follow-up', 'emergency', 'consultation'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // List of possible appointment reasons
    const reasons = [
      'Annual physical examination',
      'Blood pressure check',
      'Diabetes follow-up',
      'Skin rash evaluation',
      'Respiratory issues',
      'Joint pain consultation',
      'Headache assessment',
      'Medication review',
      'Allergy symptoms'
    ];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    
    // List of possible doctors
    const doctorId = Math.floor(Math.random() * 7) + 1;
    
    appointments.push({
      id: i + (isPast ? 100 : 0),
      patientId,
      doctorId,
      date: dateStr,
      startTime,
      endTime,
      status,
      type: type as any,
      reason,
      notes: Math.random() > 0.7 ? 'Additional notes for this appointment' : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return appointments;
};

// Generate mock time slots for a specific day
const generateMockTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Generate time slots from 9 AM to 5 PM
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time,
        isAvailable: Math.random() > 0.3 // 70% chance of being available
      });
    }
  }
  
  return slots;
};

// Create a mock service for development
const mockAppointmentApi = {
  getPatientAppointments: async (patientId: number): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...generateMockAppointments(patientId, 5, false), ...generateMockAppointments(patientId, 8, true)];
  },
  
  getUpcomingAppointments: async (patientId: number): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockAppointments(patientId, 5, false).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
  
  getPastAppointments: async (patientId: number): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockAppointments(patientId, 8, true).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  getAppointmentById: async (appointmentId: number): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allAppointments = [
      ...generateMockAppointments(101, 5, false),
      ...generateMockAppointments(101, 8, true)
    ];
    const appointment = allAppointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    return appointment;
  },
  
  getDoctorTimeSlots: async (doctorId: number, date: string): Promise<TimeSlot[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return generateMockTimeSlots(date);
  },
  
  createAppointment: async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: Math.floor(Math.random() * 1000) + 200,
      patientId: appointmentData.patientId || 0,
      doctorId: appointmentData.doctorId || 0,
      date: appointmentData.date || '',
      startTime: appointmentData.startTime || '',
      endTime: appointmentData.endTime || '',
      status: appointmentData.status as any || 'scheduled',
      type: appointmentData.type as any || 'regular',
      reason: appointmentData.reason || '',
      notes: appointmentData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  cancelAppointment: async (appointmentId: number): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
};

// Define the appointment state interface
interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  currentAppointment: Appointment | null;
  availableTimeSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
}

// Initial state
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
      const appointments = await mockAppointmentApi.getPatientAppointments(patientId);
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
      const appointments = await mockAppointmentApi.getUpcomingAppointments(patientId);
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
      const appointments = await mockAppointmentApi.getPastAppointments(patientId);
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
      const appointment = await mockAppointmentApi.getAppointmentById(appointmentId);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointment details');
    }
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'appointment/fetchTimeSlots',
  async ({ doctorId, date }: { doctorId: number; date: string }, { rejectWithValue }) => {
    try {
      const timeSlots = await mockAppointmentApi.getDoctorTimeSlots(doctorId, date);
      return timeSlots;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch available time slots');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointment/book',
  async (appointmentData: Partial<Appointment>, { rejectWithValue }) => {
    try {
      const appointment = await mockAppointmentApi.createAppointment(appointmentData);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to book appointment');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointment/cancel',
  async (appointmentId: number, { rejectWithValue, dispatch }) => {
    try {
      const result = await mockAppointmentApi.cancelAppointment(appointmentId);
      
      if (result.success) {
        // Refresh upcoming appointments after cancellation
        // Note: In a real app, you might want to get the user ID from state
        dispatch(fetchUpcomingAppointments(101)); // Using mock patient ID for simplicity
        return appointmentId;
      } else {
        return rejectWithValue('Failed to cancel appointment');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel appointment');
    }
  }
);

// Create the appointment slice
const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
    clearAppointmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.appointments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch upcoming appointments
      .addCase(fetchUpcomingAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.upcomingAppointments = action.payload;
        state.loading = false;
      })
      .addCase(fetchUpcomingAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch past appointments
      .addCase(fetchPastAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.pastAppointments = action.payload;
        state.loading = false;
      })
      .addCase(fetchPastAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch appointment by ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.currentAppointment = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch time slots
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action: PayloadAction<TimeSlot[]>) => {
        state.availableTimeSlots = action.payload;
        state.loading = false;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.upcomingAppointments = [action.payload, ...state.upcomingAppointments];
        state.loading = false;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action: PayloadAction<number>) => {
        // Update the appointment status in the upcomingAppointments array
        state.upcomingAppointments = state.upcomingAppointments.map(appointment => 
          appointment.id === action.payload
            ? { ...appointment, status: 'cancelled' }
            : appointment
        );
        
        // If the current appointment is the one being cancelled, update it too
        if (state.currentAppointment && state.currentAppointment.id === action.payload) {
          state.currentAppointment = {
            ...state.currentAppointment,
            status: 'cancelled'
          };
        }
        
        state.loading = false;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentAppointment, clearAppointmentError } = appointmentSlice.actions;

export default appointmentSlice.reducer; 