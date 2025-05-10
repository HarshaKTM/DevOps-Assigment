import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppointmentList from '../../components/Appointments/AppointmentList';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchAppointments, 
  fetchUpcomingAppointments, 
  fetchPastAppointments, 
  cancelAppointment as cancelAppointmentAction 
} from '../../store/slices/appointmentSlice';
import { Appointment } from '../../store/slices/appointmentSlice';

const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    upcomingAppointments, 
    pastAppointments, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.appointment);
  
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') {
        dispatch(fetchUpcomingAppointments(user.id));
        dispatch(fetchPastAppointments(user.id));
      } else if (user.role === 'doctor') {
        // If user is a doctor, we would fetch their appointments
        // dispatch(fetchDoctorUpcomingAppointments(user.id));
        // dispatch(fetchDoctorPastAppointments(user.id));
      }
    }
  }, [dispatch, user]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleNewAppointment = () => {
    navigate('/appointments/new');
  };
  
  const handleViewAppointment = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };
  
  const handleEditAppointment = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}/edit`);
  };
  
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await dispatch(cancelAppointmentAction(appointmentId)).unwrap();
      setNotification({ 
        message: 'Appointment cancelled successfully', 
        type: 'success' 
      });
    } catch (error) {
      setNotification({ 
        message: 'Failed to cancel appointment', 
        type: 'error' 
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification(null);
  };
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading appointments: {error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Appointments
        </Typography>
        {user?.role === 'patient' && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleNewAppointment}
          >
            Book New Appointment
          </Button>
        )}
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Upcoming" />
          <Tab label="Past" />
        </Tabs>
        
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {activeTab === 0 && (
                upcomingAppointments.length > 0 ? (
                  <AppointmentList 
                    appointments={upcomingAppointments}
                    onViewAppointment={handleViewAppointment}
                    onEditAppointment={handleEditAppointment}
                    onCancelAppointment={handleCancelAppointment}
                    showActions={true}
                  />
                ) : (
                  <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                    No upcoming appointments.
                  </Typography>
                )
              )}
              
              {activeTab === 1 && (
                pastAppointments.length > 0 ? (
                  <AppointmentList 
                    appointments={pastAppointments}
                    onViewAppointment={handleViewAppointment}
                    showActions={true}
                  />
                ) : (
                  <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                    No past appointments.
                  </Typography>
                )
              )}
            </Box>
          )}
        </Box>
      </Paper>
      
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        {notification ? (
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        ) : <span />}
      </Snackbar>
    </Box>
  );
};

export default AppointmentsPage; 