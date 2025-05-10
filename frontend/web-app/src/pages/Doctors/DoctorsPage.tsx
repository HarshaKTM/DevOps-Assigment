import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  TablePagination,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { fetchDoctors, deleteDoctor, selectDoctors, selectLoading, selectError } from '../../store/slices/doctorSlice';
import { AppDispatch, RootState } from '../../store';

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const doctors = useSelector(selectDoctors);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleAddDoctor = () => {
    navigate('/doctors/add');
  };

  const handleEditDoctor = (id: number) => {
    navigate(`/doctors/${id}/edit`);
  };

  const handleViewDoctor = (id: number) => {
    navigate(`/doctors/${id}`);
  };

  const openDeleteDialog = (id: number) => {
    setDoctorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDoctor = () => {
    if (doctorToDelete) {
      dispatch(deleteDoctor(doctorToDelete));
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDoctors = filteredDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Doctors Management
        </Typography>
        
        {user?.role === 'admin' || user?.role === 'administrator' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddDoctor}
            sx={{ ml: 2 }}
          >
            Add New Doctor
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Search doctors"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ maxWidth: '500px' }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading doctors...
                </TableCell>
              </TableRow>
            ) : paginatedDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              paginatedDoctors.map((doctor) => (
                <TableRow key={doctor.id} hover>
                  <TableCell onClick={() => handleViewDoctor(doctor.id)} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={doctor.avatar} alt={`${doctor.firstName} ${doctor.lastName}`} sx={{ mr: 2 }}>
                        {doctor.firstName[0]}
                      </Avatar>
                      <Typography>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.isActive !== undefined ? (doctor.isActive ? 'Active' : 'Inactive') : 'Active'}
                      color={doctor.isActive !== undefined ? (doctor.isActive ? 'success' : 'default') : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewDoctor(doctor.id)}>
                      <SearchIcon />
                    </IconButton>
                    
                    {(user?.role === 'admin' || user?.role === 'administrator') && (
                      <>
                        <IconButton onClick={() => handleEditDoctor(doctor.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => openDeleteDialog(doctor.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDoctors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Doctor Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this doctor? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteDoctor} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorsPage; 