import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchDoctorById, createDoctor, updateDoctor } from '../../store/slices/doctorSlice';
import { SelectChangeEvent } from '@mui/material/Select';

interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  qualifications: string[];
  yearsOfExperience: number;
  about: string;
  education: string[];
  avatar?: string;
}

const specializations = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Urology',
];

const DoctorFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDoctor, loading, error } = useSelector(
    (state: RootState) => state.doctor
  );

  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    qualifications: [],
    yearsOfExperience: 0,
    about: '',
    education: [''],
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedDoctor) {
      setFormData({
        firstName: selectedDoctor.firstName,
        lastName: selectedDoctor.lastName,
        email: selectedDoctor.email,
        specialization: selectedDoctor.specialization,
        qualifications: selectedDoctor.qualifications,
        yearsOfExperience: selectedDoctor.yearsOfExperience,
        about: selectedDoctor.about,
        education: selectedDoctor.education,
        avatar: selectedDoctor.avatar,
      });
    }
  }, [selectedDoctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'qualifications') {
      // Convert comma-separated string to array
      const qualificationsArray = value.split(',').map(q => q.trim()).filter(q => q !== '');
      setFormData(prev => ({
        ...prev,
        qualifications: qualificationsArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEducationChange = (index: number, value: string) => {
    const newEducation = [...formData.education];
    newEducation[index] = value;
    setFormData((prev) => ({
      ...prev,
      education: newEducation,
    }));
  };

  const addEducationField = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, ''],
    }));
  };

  const removeEducationField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateDoctor({ id: parseInt(id), ...formData }));
      } else {
        await dispatch(createDoctor(formData));
      }
      navigate('/doctors');
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Edit Doctor' : 'Add New Doctor'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Specialization</InputLabel>
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleSelectChange}
                  label="Specialization"
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                name="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qualifications"
                name="qualifications"
                value={formData.qualifications.join(', ')}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About"
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              {formData.education.map((edu, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Education ${index + 1}`}
                    value={edu}
                    onChange={(e) => handleEducationChange(index, e.target.value)}
                    required
                  />
                  {index > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeEducationField(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={addEducationField}
                sx={{ mt: 1 }}
              >
                Add Education
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : id ? 'Update Doctor' : 'Add Doctor'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/doctors')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default DoctorFormPage; 