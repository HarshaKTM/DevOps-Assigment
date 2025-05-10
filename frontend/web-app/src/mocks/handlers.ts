import { rest } from 'msw';
import { format } from 'date-fns';
import { Appointment } from '../store/slices/appointmentSlice';

// Mock data
import { mockUser } from './mockData/users';
import { mockAppointments } from './mockData/appointments';
import { mockDoctors } from './mockData/doctors';
import { mockMedicalRecords } from './mockData/medicalRecords';

// Mock token
const mockToken = 'mock-jwt-token-for-testing';

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body as any;
    
    if (email === 'patient@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          user: mockUser,
          token: mockToken
        })
      );
    } else {
      return res(
        ctx.status(401),
        ctx.json({
          error: { message: 'Invalid email or password' }
        })
      );
    }
  }),
  
  rest.post('/api/auth/register', (req, res, ctx) => {
    const userData = req.body as any;
    
    if (userData.email && userData.password && userData.firstName && userData.lastName) {
      return res(
        ctx.status(201),
        ctx.json({
          user: {
            ...mockUser,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          },
          token: mockToken
        })
      );
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          error: { message: 'All fields are required' }
        })
      );
    }
  }),
  
  rest.get('/api/auth/me', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader && authHeader.includes(mockToken)) {
      return res(
        ctx.status(200),
        ctx.json(mockUser)
      );
    } else {
      return res(
        ctx.status(401),
        ctx.json({
          error: { message: 'Unauthorized' }
        })
      );
    }
  }),
  
  // Appointments endpoints
  rest.get('/api/appointments/patient/:patientId', (req, res, ctx) => {
    const { patientId } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json(mockAppointments.filter((a: Appointment) => a.patientId === Number(patientId)))
    );
  }),
  
  rest.get('/api/appointments/patient/:patientId/upcoming', (req, res, ctx) => {
    const { patientId } = req.params;
    const currentDate = new Date().toISOString().split('T')[0];
    
    const upcomingAppointments = mockAppointments.filter(
      (a: Appointment) => a.patientId === Number(patientId) && a.date >= currentDate && a.status === 'scheduled'
    );
    
    return res(
      ctx.status(200),
      ctx.json(upcomingAppointments)
    );
  }),
  
  rest.get('/api/appointments/patient/:patientId/past', (req, res, ctx) => {
    const { patientId } = req.params;
    const currentDate = new Date().toISOString().split('T')[0];
    
    const pastAppointments = mockAppointments.filter(
      (a: Appointment) => a.patientId === Number(patientId) && 
          (a.date < currentDate || ['completed', 'cancelled', 'no-show'].includes(a.status))
    );
    
    return res(
      ctx.status(200),
      ctx.json(pastAppointments)
    );
  }),
  
  rest.get('/api/appointments/:id', (req, res, ctx) => {
    const { id } = req.params;
    const appointment = mockAppointments.find((a: Appointment) => a.id === Number(id));
    
    if (appointment) {
      return res(
        ctx.status(200),
        ctx.json(appointment)
      );
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          error: { message: 'Appointment not found' }
        })
      );
    }
  }),
  
  rest.post('/api/appointments', (req, res, ctx) => {
    const appointmentData = req.body as any;
    
    const newAppointment = {
      id: Math.floor(Math.random() * 1000) + 200,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return res(
      ctx.status(201),
      ctx.json(newAppointment)
    );
  }),
  
  rest.put('/api/appointments/:id', (req, res, ctx) => {
    const { id } = req.params;
    const appointmentData = req.body as any;
    const appointmentIndex = mockAppointments.findIndex((a: Appointment) => a.id === Number(id));
    
    if (appointmentIndex !== -1) {
      const updatedAppointment = {
        ...mockAppointments[appointmentIndex],
        ...appointmentData,
        updatedAt: new Date().toISOString()
      };
      
      return res(
        ctx.status(200),
        ctx.json(updatedAppointment)
      );
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          error: { message: 'Appointment not found' }
        })
      );
    }
  }),
  
  rest.patch('/api/appointments/:id/cancel', (req, res, ctx) => {
    const { id } = req.params;
    const appointmentIndex = mockAppointments.findIndex((a: Appointment) => a.id === Number(id));
    
    if (appointmentIndex !== -1) {
      return res(
        ctx.status(200),
        ctx.json({ success: true })
      );
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          error: { message: 'Appointment not found' }
        })
      );
    }
  }),
  
  // Doctors endpoints
  rest.get('/api/doctors', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockDoctors)
    );
  }),
  
  rest.get('/api/doctors/:id', (req, res, ctx) => {
    const { id } = req.params;
    const doctor = mockDoctors.find(d => d.id === Number(id));
    
    if (doctor) {
      return res(
        ctx.status(200),
        ctx.json(doctor)
      );
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          error: { message: 'Doctor not found' }
        })
      );
    }
  }),
  
  rest.get('/api/doctors/specialization/:specialization', (req, res, ctx) => {
    const { specialization } = req.params;
    const doctors = mockDoctors.filter(
      d => d.specialization.toLowerCase() === specialization.toString().toLowerCase()
    );
    
    return res(
      ctx.status(200),
      ctx.json(doctors)
    );
  }),
  
  // Medical Records endpoints
  rest.get('/api/medical-records/patient/:patientId', (req, res, ctx) => {
    const { patientId } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json(mockMedicalRecords.filter(r => r.patientId === Number(patientId)))
    );
  }),
  
  rest.get('/api/medical-records/:id', (req, res, ctx) => {
    const { id } = req.params;
    const record = mockMedicalRecords.find(r => r.id === Number(id));
    
    if (record) {
      return res(
        ctx.status(200),
        ctx.json(record)
      );
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          error: { message: 'Medical record not found' }
        })
      );
    }
  }),
  
  rest.get('/api/medical-records/patient/:patientId/type/:recordType', (req, res, ctx) => {
    const { patientId, recordType } = req.params;
    
    const records = mockMedicalRecords.filter(
      r => r.patientId === Number(patientId) && r.recordType === recordType
    );
    
    return res(
      ctx.status(200),
      ctx.json(records)
    );
  }),
  
  rest.post('/api/medical-records', (req, res, ctx) => {
    const recordData = req.body as any;
    
    const newRecord = {
      id: Math.floor(Math.random() * 1000) + 100,
      ...recordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return res(
      ctx.status(201),
      ctx.json(newRecord)
    );
  }),
]; 