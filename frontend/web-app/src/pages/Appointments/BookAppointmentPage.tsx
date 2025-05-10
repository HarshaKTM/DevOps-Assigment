import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, isWeekend } from 'date-fns';
import { AppDispatch } from '../../store';
import { createAppointment } from '../../store/slices/appointmentSlice';
import { fetchDoctors, fetchDoctorsBySpecialization, selectDoctors, selectLoading } from '../../store/slices/doctorSlice';
import { selectUser } from '../../store/slices/authSlice';
import { TimeSlot, appointmentService } from '../../services/appointmentService';
import TimeSlotSelector from '../../components/Appointments/TimeSlotSelector';

const appointmentTypes = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'emergency', label: 'Emergency' },
];

const specializations = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Obstetrics',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology',
];

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get URL query params
  const queryParams = new URLSearchParams(location.search);
  const preselectedDoctorId = queryParams.get('doctorId');
  
  const user = useSelector(selectUser);
  const doctors = useSelector(selectDoctors);
  const isLoading = useSelector(selectLoading);
  
  const [step, setStep] = useState(1);
  const [specialization, setSpecialization] = useState('');
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [reason, setReason] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Form validation
  const [errors, setErrors] = useState({
    specialization: '',
    doctorId: '',
    appointmentDate: '',
    appointmentType: '',
    timeSlot: '',
    reason: '',
  });
  
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
  
  useEffect(() => {
    if (preselectedDoctorId) {
      setDoctorId(parseInt(preselectedDoctorId, 10));
      // Find doctor to set specialization
      const doctor = doctors.find(d => d.id === parseInt(preselectedDoctorId, 10));
      if (doctor) {
        setSpecialization(doctor.specialization);
      }
      setStep(2);
    }
  }, [preselectedDoctorId, doctors]);
  
  useEffect(() => {
    if (specialization) {
      dispatch(fetchDoctorsBySpecialization(specialization));
    }
  }, [dispatch, specialization]);
  
  useEffect(() => {
    if (doctorId && appointmentDate) {
      fetchTimeSlots();
    }
  }, [doctorId, appointmentDate]);
  
  const fetchTimeSlots = async () => {
    if (!doctorId || !appointmentDate) return;
    
    setLoadingTimeSlots(true);
    setSelectedTimeSlot(null);
    
    try {
      const formattedDate = format(appointmentDate, 'yyyy-MM-dd');
      const slots = await appointmentService.fetchAvailableTimeSlots(doctorId as number, formattedDate);
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch available time slots',
        severity: 'error',
      });
    } finally {
      setLoadingTimeSlots(false);
    }
  };
  
  const validateStep1 = () => {
    const newErrors = { ...errors };
    
    if (!specialization) {
      newErrors.specialization = 'Please select a specialization';
    } else {
      newErrors.specialization = '';
    }
    
    if (!doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    } else {
      newErrors.doctorId = '';
    }
    
    setErrors(newErrors);
    
    return !newErrors.specialization && !newErrors.doctorId;
  };
  
  const validateStep2 = () => {
    const newErrors = { ...errors };
    
    if (!appointmentDate) {
      newErrors.appointmentDate = 'Please select a date';
    } else {
      newErrors.appointmentDate = '';
    }
    
    if (!selectedTimeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    } else {
      newErrors.timeSlot = '';
    }
    
    if (!appointmentType) {
      newErrors.appointmentType = 'Please select an appointment type';
    } else {
      newErrors.appointmentType = '';
    }
    
    setErrors(newErrors);
    
    return !newErrors.appointmentDate && !newErrors.timeSlot && !newErrors.appointmentType;
  };
  
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !doctorId || !appointmentDate || !selectedTimeSlot || !appointmentType) {
      return;
    }
    
    try {
      await dispatch(createAppointment({
        patientId: user.id,
        doctorId: doctorId as number,
        date: format(appointmentDate, 'yyyy-MM-dd'),
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        type: appointmentType as 'consultation' | 'follow-up' | 'emergency',
        status: 'scheduled',
        reason: reason || undefined,
      }));
      
      setNotification({
        open: true,
        message: 'Appointment booked successfully!',
        severity: 'success',
      });
      
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setNotification({
        open: true,
        message: 'Failed to book appointment',
        severity: 'error',
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };
  
  const disableWeekends = (date: Date) => {
    return isWeekend(date);
  };
  
  const renderSelectedDoctor = () => {
    if (!doctorId) return null;
    
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return null;
    
    return (
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selected Doctor
        </Typography>
        <Typography variant="body1">
          Dr. {doctor.firstName} {doctor.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {doctor.specialization} • {doctor.yearsOfExperience} years experience
        </Typography>
      </Box>
    );
  };
  
  const filteredDoctors = specialization
    ? doctors.filter(doctor => doctor.specialization === specialization)
    : doctors;
  
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Book an Appointment
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: step >= 1 ? 'primary.main' : 'action.disabled',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              1
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: step === 1 ? 'bold' : 'normal',
                color: step === 1 ? 'text.primary' : 'text.secondary',
              }}
            >
              Select Doctor
            </Typography>
            
            <Box sx={{ flex: 1, mx: 2, display: 'flex', alignItems: 'center' }}>
              <Divider sx={{ width: '100%' }} />
            </Box>
            
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: step >= 2 ? 'primary.main' : 'action.disabled',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              2
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: step === 2 ? 'bold' : 'normal',
                color: step === 2 ? 'text.primary' : 'text.secondary',
              }}
            >
              Select Date & Time
            </Typography>
            
            <Box sx={{ flex: 1, mx: 2, display: 'flex', alignItems: 'center' }}>
              <Divider sx={{ width: '100%' }} />
            </Box>
            
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: step >= 3 ? 'primary.main' : 'action.disabled',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              3
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: step === 3 ? 'bold' : 'normal',
                color: step === 3 ? 'text.primary' : 'text.secondary',
              }}
            >
              Confirm Details
            </Typography>
          </Box>
        </Box>
        
        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.specialization}>
                  <InputLabel id="specialization-label">Specialization</InputLabel>
                  <Select
                    labelId="specialization-label"
                    id="specialization"
                    value={specialization}
                    label="Specialization"
                    onChange={(e) => setSpecialization(e.target.value)}
                  >
                    {specializations.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.specialization && (
                    <FormHelperText>{errors.specialization}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.doctorId}>
                  <InputLabel id="doctor-label">Doctor</InputLabel>
                  <Select
                    labelId="doctor-label"
                    id="doctor"
                    value={doctorId}
                    label="Doctor"
                    onChange={(e) => setDoctorId(e.target.value as number)}
                    disabled={!specialization || isLoading}
                  >
                    {isLoading ? (
                      <MenuItem disabled>Loading doctors...</MenuItem>
                    ) : filteredDoctors.length === 0 ? (
                      <MenuItem disabled>No doctors available</MenuItem>
                    ) : (
                      filteredDoctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName} ({doctor.yearsOfExperience} yrs exp)
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.doctorId && (
                    <FormHelperText>{errors.doctorId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            
            {renderSelectedDoctor()}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!specialization || !doctorId}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Step 2: Select Date and Time */}
        {step === 2 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Appointment Date"
                    value={appointmentDate}
                    onChange={(newDate) => setAppointmentDate(newDate)}
                    disablePast
                    shouldDisableDate={disableWeekends}
                    minDate={addDays(new Date(), 1)}
                    maxDate={addDays(new Date(), 30)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.appointmentDate,
                        helperText: errors.appointmentDate || 'Select a weekday in the next 30 days',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.appointmentType}>
                  <InputLabel id="type-label">Appointment Type</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    value={appointmentType}
                    label="Appointment Type"
                    onChange={(e) => setAppointmentType(e.target.value)}
                  >
                    {appointmentTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.appointmentType && (
                    <FormHelperText>{errors.appointmentType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Available Time Slots
                </Typography>
                
                {loadingTimeSlots ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : !appointmentDate ? (
                  <Alert severity="info">
                    Please select a date to see available time slots
                  </Alert>
                ) : availableTimeSlots.length === 0 ? (
                  <Alert severity="warning">
                    No available time slots for the selected date. Please try another day.
                  </Alert>
                ) : (
                  <TimeSlotSelector
                    timeSlots={availableTimeSlots}
                    selectedTimeSlot={selectedTimeSlot}
                    onSelectTimeSlot={setSelectedTimeSlot}
                  />
                )}
                
                {errors.timeSlot && (
                  <FormHelperText error>{errors.timeSlot}</FormHelperText>
                )}
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!appointmentDate || !appointmentType || !selectedTimeSlot}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Step 3: Confirm Details */}
        {step === 3 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Appointment Details
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Doctor
                </Typography>
                <Typography variant="body1">
                  {doctors.find(d => d.id === doctorId)?.firstName} {doctors.find(d => d.id === doctorId)?.lastName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Specialization
                </Typography>
                <Typography variant="body1">
                  {specialization}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {appointmentDate ? format(appointmentDate, 'EEEE, MMMM d, yyyy') : ''}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Time
                </Typography>
                <Typography variant="body1">
                  {selectedTimeSlot ? `${format(new Date(`2000-01-01T${selectedTimeSlot.startTime}`), 'h:mm a')} - 
                    ${format(new Date(`2000-01-01T${selectedTimeSlot.endTime}`), 'h:mm a')}` : 
                    ''}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {appointmentType.replace('-', ' ')}
                </Typography>
              </Grid>
            </Grid>
            
            <TextField
              id="reason"
              label="Reason for Visit (Optional)"
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
              placeholder="Please briefly describe your symptoms or reason for the appointment..."
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Book Appointment
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookAppointmentPage; 