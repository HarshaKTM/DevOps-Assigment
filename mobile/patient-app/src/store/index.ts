import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';
import doctorReducer from './slices/doctorSlice';
import medicalRecordReducer from './slices/medicalRecordSlice';
import notificationReducer from './slices/notificationSlice';
import patientReducer from './slices/patientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
    doctor: doctorReducer,
    medicalRecord: medicalRecordReducer,
    notification: notificationReducer,
    patient: patientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 