import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';
import doctorReducer from './slices/doctorSlice';
import medicalRecordsReducer from './slices/medicalRecordsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
    doctor: doctorReducer,
    medicalRecords: medicalRecordsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/registerSuccess'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 