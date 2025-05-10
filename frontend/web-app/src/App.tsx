import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import AppointmentsPage from './pages/Appointments/AppointmentsPage';
import BookAppointmentPage from './pages/Appointments/BookAppointmentPage';
import AppointmentDetailsPage from './pages/Appointments/AppointmentDetailsPage';
import DoctorsPage from './pages/Doctors/DoctorsPage';
import DoctorDetailsPage from './pages/Doctors/DoctorDetailsPage';
import PatientsPage from './pages/Patients/PatientsPage';
import PatientDetailsPage from './pages/Patients/PatientDetailsPage';
import MedicalRecordsPage from './pages/MedicalRecords/MedicalRecordsPage';
import MedicalRecordDetailsPage from './pages/MedicalRecords/MedicalRecordDetailsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import DoctorFormPage from './pages/Doctors/DoctorFormPage';
import PatientFormPage from './pages/Patients/PatientFormPage';

// Redux
import { loadUser, selectIsAuthenticated, selectUser } from './store/slices/authSlice';

// Theme
import theme from './theme/theme';
import { AppDispatch } from './store';

// Guard for protected routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Guard for role-based routes
const RequireRole = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'patient') {
      return <Navigate to="/dashboard" />;
    } else if (user.role === 'doctor') {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/login" />;
    }
  }
  
  return children;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
            
            {/* App routes */}
            <Route element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              {/* Dashboard - accessible by all authenticated users */}
              <Route 
                path="/dashboard" 
                element={<DashboardPage />} 
              />
              
              {/* Appointments - accessible by all but with different views */}
              <Route 
                path="/appointments" 
                element={<AppointmentsPage />} 
              />
              
              {/* Patient-only routes */}
              <Route 
                path="/appointments/book" 
                element={<BookAppointmentPage />} 
              />
              
              <Route 
                path="/appointments/:id" 
                element={<AppointmentDetailsPage />} 
              />
              
              {/* Doctors management - Admin only */}
              <Route 
                path="/doctors" 
                element={<DoctorsPage />} 
              />
              
              <Route 
                path="/doctors/new" 
                element={
                  <RequireRole allowedRoles={['doctor']}>
                    <DoctorFormPage />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/doctors/:id/edit" 
                element={
                  <RequireRole allowedRoles={['doctor']}>
                    <DoctorFormPage />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/doctors/:id" 
                element={<DoctorDetailsPage />} 
              />
              
              {/* Patients management - Admin and Doctor only */}
              <Route 
                path="/patients" 
                element={
                  <RequireRole allowedRoles={['doctor']}>
                    <PatientsPage />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/patients/new" 
                element={
                  <RequireRole allowedRoles={['doctor']}>
                    <PatientFormPage />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/patients/:id/edit" 
                element={
                  <RequireRole allowedRoles={['doctor']}>
                    <PatientFormPage />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/patients/:id" 
                element={
                  <RequireRole allowedRoles={['doctor']}>
                    <PatientDetailsPage />
                  </RequireRole>
                } 
              />
              
              {/* Medical records - accessed by doctor and patient (but filtered) */}
              <Route 
                path="/medical-records" 
                element={
                  <RequireRole allowedRoles={['doctor']}>
                    <MedicalRecordsPage />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/medical-records/:id" 
                element={
                  <RequireRole allowedRoles={['doctor', 'patient']}>
                    <MedicalRecordDetailsPage />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/profile" 
                element={<ProfilePage />} 
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App; 