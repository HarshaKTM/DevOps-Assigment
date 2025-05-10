import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  Notes,
  Assignment,
  ArrowBack,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { AppDispatch } from '../../store';
import {
  fetchAppointmentById,
  cancelAppointment,
  selectSelectedAppointment,
  selectAppointmentLoading as selectLoading,
  selectAppointmentError as selectError,
} from '../../store/slices/appointmentSlice';
import { selectUser } from '../../store/slices/authSlice';

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const appointment = useSelector(selectSelectedAppointment);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const user = useSelector(selectUser);
  
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentById(parseInt(id, 10)));
    }
  }, [dispatch, id]);
  
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };
  
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };
  
  const handleCancelAppointment = async () => {
    if (id) {
      setCancelling(true);
      try {
        await dispatch(cancelAppointment(parseInt(id, 10)));
        setCancelling(false);
        handleCloseCancelDialog();
      } catch (error) {
        setCancelling(false);
        console.error('Error cancelling appointment:', error);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getTypeLabel = (type: string) => {
    return type.replace('-', ' ');
  };
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!appointment) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Appointment not found
      </Alert>
    );
  }
  
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/appointments')}
          sx={{ mr: 2 }}
        >
          Back to Appointments
        </Button>
        <Typography variant="h5" component="h1">
          Appointment Details
        </Typography>
      </Box>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Chip
              label={appointment.status}
              color={getStatusColor(appointment.status)}
              sx={{ textTransform: 'capitalize', mb: 1 }}
            />
            <Typography variant="h6" component="h2">
              {getTypeLabel(appointment.type)} Appointment
            </Typography>
          </Box>
          
          {appointment.status === 'scheduled' && user?.role === 'patient' && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpenCancelDialog}
            >
              Cancel Appointment
            </Button>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Date:</strong> {formatDate(appointment.date)}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Time:</strong> {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Person sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Doctor:</strong> Dr. Smith {/* Replace with actual doctor name */}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Person sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Patient:</strong> John Doe {/* Replace with actual patient name */}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <Assignment sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                <Typography variant="body1" component="div">
                  <strong>Reason for Visit:</strong>
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {appointment.reason || 'No reason provided'}
              </Typography>
            </Box>
            
            {appointment.notes && (
              <Box>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <Notes sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                  <Typography variant="body1" component="div">
                    <strong>Additional Notes:</strong>
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {appointment.notes}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Cancel Appointment Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">
          Cancel Appointment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} disabled={cancelling}>
            No, Keep It
          </Button>
          <Button 
            onClick={handleCancelAppointment} 
            color="error" 
            disabled={cancelling}
            autoFocus
          >
            {cancelling ? <CircularProgress size={24} /> : 'Yes, Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentDetailsPage; 