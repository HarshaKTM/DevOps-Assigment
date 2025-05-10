import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchPatientById } from '../../store/slices/patientSlice';
import { fetchPatientAppointments } from '../../store/slices/appointmentSlice';
import { fetchPatientMedicalRecords } from '../../store/slices/medicalRecordSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = React.useState(0);

  const { selectedPatient, loading: patientLoading, error: patientError } = useSelector(
    (state: RootState) => state.patient
  );

  const { appointments, loading: appointmentsLoading } = useSelector(
    (state: RootState) => state.appointment
  );

  const { medicalRecords, loading: recordsLoading } = useSelector(
    (state: RootState) => state.medicalRecord
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientById(parseInt(id)));
      dispatch(fetchPatientAppointments(parseInt(id)));
      dispatch(fetchPatientMedicalRecords(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (patientLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (patientError) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{patientError}</Alert>
      </Box>
    );
  }

  if (!selectedPatient) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Patient not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Patient Details
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/patients')}
          >
            Back to Patients
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={selectedPatient.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              {selectedPatient.firstName} {selectedPatient.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Patient ID: {selectedPatient.id}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.gender}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Appointments" />
            <Tab label="Medical Records" />
            <Tab label="Billing" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {appointmentsLoading ? (
              <CircularProgress />
            ) : (
              <Box>
                {appointments.length === 0 ? (
                  <Typography>No appointments found</Typography>
                ) : (
                  appointments.map((appointment) => (
                    <Paper key={appointment.id} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1">
                        {new Date(appointment.date).toLocaleDateString()} - {appointment.startTime}
                      </Typography>
                      <Typography variant="body2">
                        Doctor: Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </Typography>
                      <Typography variant="body2">
                        Status: {appointment.status}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {recordsLoading ? (
              <CircularProgress />
            ) : (
              <Box>
                {medicalRecords.length === 0 ? (
                  <Typography>No medical records found</Typography>
                ) : (
                  medicalRecords.map((record) => (
                    <Paper key={record.id} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1">
                        {record.type} - {new Date(record.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Doctor: Dr. {record.doctor.firstName} {record.doctor.lastName}
                      </Typography>
                      <Typography variant="body2">
                        Diagnosis: {record.diagnosis}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography>Billing information will be displayed here</Typography>
          </TabPanel>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/patients/edit/${selectedPatient.id}`)}
          >
            Edit Patient
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/appointments/book?patientId=${selectedPatient.id}`)}
          >
            Book Appointment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientDetailsPage; 