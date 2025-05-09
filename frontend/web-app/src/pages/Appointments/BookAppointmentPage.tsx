import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  CircularProgress,
  FormHelperText,
  Alert,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isAfter, isBefore, addDays } from 'date-fns';

import TimeSlotSelector from '../../components/Appointments/TimeSlotSelector';
import { RootState, AppDispatch } from '../../store';
import { fetchAllDoctors, fetchDoctorsBySpecialization } from '../../store/slices/doctorSlice';
import { 
  fetchTimeSlots, 
  bookAppointment 
} from '../../store/slices/appointmentSlice';
import { Doctor } from '../../services/doctorService';
import { TimeSlot } from '../../services/appointmentService';

const steps = ['Select Doctor', 'Choose Date & Time', 'Appointment Details', 'Confirm'];

const BookAppointmentPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [specialization, setSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState('regular');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { doctors, doctorsBySpecialization, loading: doctorsLoading } = useSelector((state: RootState) => state.doctor);
  const { availableTimeSlots, loading: appointmentsLoading } = useSelector((state: RootState) => state.appointment);
  
  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);
  
  useEffect(() => {
    if (specialization) {
      dispatch(fetchDoctorsBySpecialization(specialization));
    }
  }, [dispatch, specialization]);
  
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      dispatch(fetchTimeSlots({ doctorId: selectedDoctor.id, date: formattedDate }));
    }
  }, [dispatch, selectedDoctor, selectedDate]);
  
  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    switch (activeStep) {
      case 0:
        if (!selectedDoctor) {
          errors.doctor = 'Please select a doctor';
        }
        break;
      case 1:
        if (!selectedDate) {
          errors.date = 'Please select a date';
        } else if (isBefore(selectedDate, new Date())) {
          errors.date = 'Please select a future date';
        }
        
        if (!selectedTimeSlot) {
          errors.timeSlot = 'Please select a time slot';
        }
        break;
      case 2:
        if (!appointmentType) {
          errors.type = 'Please select an appointment type';
        }
        
        if (!reason.trim()) {
          errors.reason = 'Please enter a reason for the appointment';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };
  
  const handleSubmit = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
      return;
    }
    
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      await dispatch(bookAppointment({
        patientId: user.id,
        doctorId: selectedDoctor.id,
        date: formattedDate,
        startTime: selectedTimeSlot.time,
        endTime: addTimeToSlot(selectedTimeSlot.time, 30), // 30 min appointments
        type: appointmentType,
        reason,
        notes: notes || undefined,
        status: 'scheduled',
      })).unwrap();
      
      setNotification({
        message: 'Appointment booked successfully!',
        type: 'success',
      });
      
      // Wait a bit before navigating
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      setNotification({
        message: 'Failed to book appointment. Please try again.',
        type: 'error',
      });
    }
  };
  
  const addTimeToSlot = (timeString: string, minutes: number): string => {
    const [hours, mins] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins);
    date.setMinutes(date.getMinutes() + minutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const handleCloseNotification = () => {
    setNotification(null);
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select a Doctor
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Specialization</InputLabel>
              <Select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                label="Specialization"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Dermatology">Dermatology</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="General Medicine">General Medicine</MenuItem>
              </Select>
            </FormControl>
            
            {doctorsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {(specialization ? doctorsBySpecialization[specialization] || [] : doctors).map((doctor) => (
                  <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: selectedDoctor?.id === doctor.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        '&:hover': {
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <Typography variant="h6">Dr. {doctor.firstName} {doctor.lastName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialization}
                      </Typography>
                      <Typography variant="body2">
                        {doctor.yearsOfExperience} years experience
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {validationErrors.doctor && (
              <FormHelperText error>{validationErrors.doctor}</FormHelperText>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Date & Time
            </Typography>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Appointment Date"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                disablePast
                sx={{ width: '100%', mb: 3 }}
              />
            </LocalizationProvider>
            
            {validationErrors.date && (
              <FormHelperText error sx={{ mt: -2, mb: 2 }}>{validationErrors.date}</FormHelperText>
            )}
            
            <Typography variant="subtitle1" gutterBottom>
              Available Time Slots
            </Typography>
            
            {appointmentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {availableTimeSlots.length > 0 ? (
                  <TimeSlotSelector
                    timeSlots={availableTimeSlots}
                    selectedTimeSlot={selectedTimeSlot}
                    onSelectTimeSlot={handleTimeSlotSelect}
                  />
                ) : (
                  <Alert severity="info">
                    No available time slots for this doctor on the selected date.
                  </Alert>
                )}
              </>
            )}
            
            {validationErrors.timeSlot && (
              <FormHelperText error>{validationErrors.timeSlot}</FormHelperText>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Appointment Details
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Appointment Type</InputLabel>
              <Select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                label="Appointment Type"
                error={!!validationErrors.type}
              >
                <MenuItem value="regular">Regular Check-up</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
                <MenuItem value="consultation">Consultation</MenuItem>
              </Select>
              {validationErrors.type && (
                <FormHelperText error>{validationErrors.type}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              label="Reason for Visit"
              fullWidth
              multiline
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mb: 3 }}
              error={!!validationErrors.reason}
              helperText={validationErrors.reason}
            />
            
            <TextField
              label="Additional Notes (optional)"
              fullWidth
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Your Appointment
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Doctor</Typography>
                <Typography variant="body1" gutterBottom>
                  Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                </Typography>
                
                <Typography variant="subtitle2">Specialization</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedDoctor?.specialization}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''}
                </Typography>
                
                <Typography variant="subtitle2">Time</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedTimeSlot ? format(new Date(`2000-01-01T${selectedTimeSlot.time}`), 'h:mm a') : ''} - {
                    selectedTimeSlot ? 
                      format(new Date(`2000-01-01T${addTimeToSlot(selectedTimeSlot.time, 30)}`), 'h:mm a') : 
                      ''
                  }
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Appointment Type</Typography>
                <Typography variant="body1" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {appointmentType}
                </Typography>
                
                <Typography variant="subtitle2">Reason for Visit</Typography>
                <Typography variant="body1" gutterBottom>
                  {reason}
                </Typography>
                
                {notes && (
                  <>
                    <Typography variant="subtitle2">Additional Notes</Typography>
                    <Typography variant="body1" gutterBottom>
                      {notes}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book an Appointment
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={doctorsLoading || appointmentsLoading}
              >
                {doctorsLoading || appointmentsLoading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Processing
                  </>
                ) : (
                  'Book Appointment'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Snackbar
        open={notification !== null}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        {notification && (
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default BookAppointmentPage; 