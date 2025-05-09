import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import NotFoundPage from './pages/NotFoundPage';
import DoctorFormPage from './pages/Doctors/DoctorFormPage';
import PatientFormPage from './pages/Patients/PatientFormPage';

// Redux
import { RootState, AppDispatch } from './store';
import { getCurrentUser } from './store/slices/authSlice';

// Theme
import theme from './theme/theme';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  
  // Protected route wrapper
  const ProtectedRoute: React.FC<{ 
    element: React.ReactNode; 
    allowedRoles?: string[] 
  }> = ({ element, allowedRoles = [] }) => {
    // Still loading auth state
    if (loading) {
      return null;
    }
    
    // Not authenticated
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    // Role-based access control
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      // Redirect based on role
      if (user.role === 'doctor') {
        return <Navigate to="/appointments" />;
      } else if (user.role === 'admin') {
        return <Navigate to="/doctors" />;
      }
      return <Navigate to="/dashboard" />;
    }
    
    return <>{element}</>;
  };
  
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
              <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
            </Route>
            
            {/* App routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              {/* Dashboard - accessible by all authenticated users */}
              <Route 
                path="/dashboard" 
                element={<ProtectedRoute element={<DashboardPage />} />} 
              />
              
              {/* Appointments - accessible by all but with different views */}
              <Route 
                path="/appointments" 
                element={<ProtectedRoute element={<AppointmentsPage />} />} 
              />
              
              {/* Patient-only routes */}
              <Route 
                path="/appointments/new" 
                element={<ProtectedRoute element={<BookAppointmentPage />} allowedRoles={['patient']} />} 
              />
              
              <Route 
                path="/appointments/:id" 
                element={<ProtectedRoute element={<AppointmentDetailsPage />} />} 
              />
              
              {/* Doctors management - Admin only */}
              <Route 
                path="/doctors" 
                element={<ProtectedRoute element={<DoctorsPage />} allowedRoles={['admin']} />} 
              />
              
              <Route 
                path="/doctors/add" 
                element={<ProtectedRoute element={<DoctorFormPage />} allowedRoles={['admin']} />} 
              />
              
              <Route 
                path="/doctors/:id/edit" 
                element={<ProtectedRoute element={<DoctorFormPage />} allowedRoles={['admin']} />} 
              />
              
              <Route 
                path="/doctors/:id" 
                element={<ProtectedRoute element={<DoctorDetailsPage />} allowedRoles={['admin', 'doctor']} />} 
              />
              
              {/* Patients management - Admin and Doctor only */}
              <Route 
                path="/patients" 
                element={<ProtectedRoute element={<PatientsPage />} allowedRoles={['admin', 'doctor']} />} 
              />
              
              <Route 
                path="/patients/add" 
                element={<ProtectedRoute element={<PatientFormPage />} allowedRoles={['admin']} />} 
              />
              
              <Route 
                path="/patients/:id/edit" 
                element={<ProtectedRoute element={<PatientFormPage />} allowedRoles={['admin']} />} 
              />
              
              <Route 
                path="/patients/:id" 
                element={<ProtectedRoute element={<PatientDetailsPage />} allowedRoles={['admin', 'doctor']} />} 
              />
              
              {/* Medical records - accessed by doctor and patient (but filtered) */}
              <Route 
                path="/medical-records" 
                element={<ProtectedRoute element={<MedicalRecordsPage />} />} 
              />
              
              <Route 
                path="/medical-records/:id" 
                element={<ProtectedRoute element={<MedicalRecordDetailsPage />} />} 
              />
              
              <Route 
                path="/profile" 
                element={<ProtectedRoute element={<ProfilePage />} />} 
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App; 