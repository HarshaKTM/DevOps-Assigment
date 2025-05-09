import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Typography, 
  CircularProgress,
  useTheme,
} from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  PointElement, 
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  PointElement, 
  LineElement
);

interface PatientDemographics {
  ageGroups: { [key: string]: number };
  genderDistribution: { [key: string]: number };
  appointmentsByMonth: { [key: string]: number };
  conditionPrevalence: { [key: string]: number };
}

const PatientStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [demographics, setDemographics] = useState<PatientDemographics>({
    ageGroups: {},
    genderDistribution: {},
    appointmentsByMonth: {},
    conditionPrevalence: {}
  });
  
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // This would typically be an API call to get patient statistics
    // For now, we'll use mock data
    const mockDemographics: PatientDemographics = {
      ageGroups: {
        '0-18': 24,
        '19-35': 45,
        '36-50': 68,
        '51-65': 37,
        '65+': 10,
      },
      genderDistribution: {
        'Male': 92,
        'Female': 86,
        'Other': 6,
      },
      appointmentsByMonth: {
        'Jan': 45,
        'Feb': 38,
        'Mar': 54,
        'Apr': 42,
        'May': 48,
        'Jun': 56,
        'Jul': 61,
        'Aug': 58,
        'Sep': 0,
        'Oct': 0,
        'Nov': 0,
        'Dec': 0,
      },
      conditionPrevalence: {
        'Hypertension': 32,
        'Diabetes': 24,
        'Asthma': 18,
        'Arthritis': 15,
        'Depression': 11,
      },
    };
    
    // Simulate API call
    setTimeout(() => {
      setDemographics(mockDemographics);
      setLoading(false);
    }, 800);
  }, [user]);
  
  // Prepare chart data
  const ageGroupsData = {
    labels: Object.keys(demographics.ageGroups),
    datasets: [
      {
        label: 'Patients by Age Group',
        data: Object.values(demographics.ageGroups),
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };
  
  const genderDistributionData = {
    labels: Object.keys(demographics.genderDistribution),
    datasets: [
      {
        label: 'Gender Distribution',
        data: Object.values(demographics.genderDistribution),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const appointmentsByMonthData = {
    labels: Object.keys(demographics.appointmentsByMonth),
    datasets: [
      {
        label: 'Appointments by Month',
        data: Object.values(demographics.appointmentsByMonth),
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}33`,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const conditionPrevalenceData = {
    labels: Object.keys(demographics.conditionPrevalence),
    datasets: [
      {
        label: 'Common Conditions',
        data: Object.values(demographics.conditionPrevalence),
        backgroundColor: [
          '#1976d2',
          '#4caf50',
          '#ff9800',
          '#f44336',
          '#9c27b0',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Card sx={{ borderRadius: 2, mb: 3 }}>
      <CardHeader
        title="Patient Statistics"
        subheader="Overview of patient demographics and appointment trends"
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Patient Age Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={ageGroupsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Appointments by Month
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={appointmentsByMonthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Gender Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '80%', maxWidth: 300 }}>
                <Pie
                  data={genderDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Common Conditions
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '80%', maxWidth: 300 }}>
                <Pie
                  data={conditionPrevalenceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PatientStatistics; 