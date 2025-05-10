import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  Person,
  Description,
  LocalHospital,
  Attachment,
  ArrowBack,
  PictureAsPdf,
  Image,
  InsertDriveFile,
  Delete,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { AppDispatch, RootState } from '../../store';
import { fetchMedicalRecordById, deleteMedicalRecord } from '../../store/slices/medicalRecordSlice';

const MedicalRecordDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const medicalRecord = useSelector((state: RootState) => state.medicalRecord.selectedRecord);
  const loading = useSelector((state: RootState) => state.medicalRecord.loading);
  const error = useSelector((state: RootState) => state.medicalRecord.error);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchMedicalRecordById(parseInt(id, 10)));
    }
  }, [dispatch, id]);
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteConfirm = async () => {
    if (id) {
      setIsDeleting(true);
      try {
        await dispatch(deleteMedicalRecord(parseInt(id, 10)));
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        navigate('/medical-records');
      } catch (error) {
        setIsDeleting(false);
        console.error('Error deleting medical record:', error);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  const getAttachmentIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <PictureAsPdf color="error" />;
    } else if (fileType.includes('image')) {
      return <Image color="primary" />;
    } else {
      return <InsertDriveFile color="action" />;
    }
  };
  
  if (loading) {
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
  
  if (!medicalRecord) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Medical record not found
      </Alert>
    );
  }
  
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/medical-records')}
          sx={{ mr: 2 }}
        >
          Back to Medical Records
        </Button>
        <Typography variant="h5" component="h1">
          Medical Record Details
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteClick}
          startIcon={<Delete />}
        >
          Delete Record
        </Button>
      </Box>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" component="h2">
              {medicalRecord.recordType || `Medical Record ${medicalRecord.id}`}
            </Typography>
            <Chip
              label={medicalRecord.recordType?.replace('_', ' ')}
              color="primary"
              size="small"
              sx={{ mt: 1, textTransform: 'capitalize' }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Date:</strong> {formatDate(medicalRecord.date)}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Person sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Patient ID:</strong> {medicalRecord.patientId}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Performed By:</strong> {`Doctor #${medicalRecord.doctorId}`}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {(medicalRecord.prescription || medicalRecord.notes) && (
              <Box mb={2}>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <Description sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                  <Typography variant="body1" component="div">
                    <strong>Details:</strong>
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {medicalRecord.prescription || medicalRecord.notes || ''}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        
        {medicalRecord.attachments && Array.isArray(medicalRecord.attachments) && medicalRecord.attachments.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              <Box display="flex" alignItems="center">
                <Attachment sx={{ mr: 1 }} />
                Attachments
              </Box>
            </Typography>
            <List>
              {medicalRecord.attachments.map((attachment, index) => {
                // Safely cast to any to handle unknown attachment structure
                const attachmentItem = attachment as any;
                const attachmentUrl = typeof attachment === 'string' ? attachment : attachmentItem.url || '';
                const attachmentName = typeof attachment === 'string' ? `Attachment ${index + 1}` : attachmentItem.name || `Attachment ${index + 1}`;
                const attachmentType = typeof attachment === 'string' ? 'document' : attachmentItem.type || 'document';
                const attachmentSize = typeof attachment === 'string' ? 0 : attachmentItem.size || 0;
                
                return (
                  <ListItem
                    key={index}
                    button
                    component="a"
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ListItemIcon>
                      {getAttachmentIcon(attachmentType)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={attachmentName}
                      secondary={attachmentSize ? `${(attachmentSize / 1024).toFixed(2)} KB` : ''}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Medical Record
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this medical record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error" 
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalRecordDetailsPage; 