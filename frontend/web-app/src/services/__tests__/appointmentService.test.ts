import { appointmentService } from '../appointmentService';
import { server } from '../../mocks/server';
import { rest } from 'msw';
import { mockAppointments } from '../../mocks/mockData/appointments';

describe('Appointment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('getAppointments should return appointments for a patient', async () => {
    const patientId = 101;
    
    // Add a specific handler for this test
    server.use(
      rest.get(`/api/appointments/patient/${patientId}`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(mockAppointments.filter(a => a.patientId === patientId))
        );
      })
    );
    
    const result = await appointmentService.getAppointments(patientId);
    
    expect(result).toHaveLength(mockAppointments.filter(a => a.patientId === patientId).length);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('status');
  });
  
  test('getUpcomingAppointments should return upcoming appointments', async () => {
    const patientId = 101;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Add a specific handler for this test
    server.use(
      rest.get(`/api/appointments/patient/${patientId}/upcoming`, (req, res, ctx) => {
        const upcomingAppointments = mockAppointments.filter(
          a => a.patientId === patientId && a.date >= currentDate && a.status === 'scheduled'
        );
        
        return res(
          ctx.status(200),
          ctx.json(upcomingAppointments)
        );
      })
    );
    
    const result = await appointmentService.getUpcomingAppointments(patientId);
    
    // Verify all appointments are upcoming (scheduled and future date)
    result.forEach(appointment => {
      expect(appointment.status).toBe('scheduled');
      expect(new Date(appointment.date).getTime()).toBeGreaterThanOrEqual(new Date(currentDate).getTime());
    });
  });
  
  test('getPastAppointments should return past appointments', async () => {
    const patientId = 101;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Add a specific handler for this test
    server.use(
      rest.get(`/api/appointments/patient/${patientId}/past`, (req, res, ctx) => {
        const pastAppointments = mockAppointments.filter(
          a => a.patientId === patientId && 
             (a.date < currentDate || ['completed', 'cancelled', 'no-show'].includes(a.status))
        );
        
        return res(
          ctx.status(200),
          ctx.json(pastAppointments)
        );
      })
    );
    
    const result = await appointmentService.getPastAppointments(patientId);
    
    // Verify all appointments are past (completed, cancelled, no-show or past date)
    result.forEach(appointment => {
      const isPastDate = new Date(appointment.date).getTime() < new Date(currentDate).getTime();
      const isPastStatus = ['completed', 'cancelled', 'no-show'].includes(appointment.status);
      
      expect(isPastDate || isPastStatus).toBeTruthy();
    });
  });
  
  test('getAppointmentById should return a specific appointment', async () => {
    const appointmentId = 1;
    
    // Add a specific handler for this test
    server.use(
      rest.get(`/api/appointments/${appointmentId}`, (req, res, ctx) => {
        const appointment = mockAppointments.find(a => a.id === appointmentId);
        
        if (appointment) {
          return res(ctx.status(200), ctx.json(appointment));
        } else {
          return res(
            ctx.status(404),
            ctx.json({ error: { message: 'Appointment not found' } })
          );
        }
      })
    );
    
    const result = await appointmentService.getAppointmentById(appointmentId);
    
    expect(result).toHaveProperty('id', appointmentId);
  });
  
  test('bookAppointment should create a new appointment', async () => {
    const appointmentData = {
      patientId: 101,
      doctorId: 2,
      date: '2023-06-15',
      startTime: '10:00',
      endTime: '10:30',
      type: 'regular',
      reason: 'Annual checkup'
    };
    
    // Add a specific handler for this test
    server.use(
      rest.post('/api/appointments', (req, res, ctx) => {
        const newAppointment = {
          id: 999,
          ...appointmentData,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return res(ctx.status(201), ctx.json(newAppointment));
      })
    );
    
    const result = await appointmentService.bookAppointment(appointmentData);
    
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('status', 'scheduled');
    expect(result.patientId).toBe(appointmentData.patientId);
    expect(result.doctorId).toBe(appointmentData.doctorId);
    expect(result.date).toBe(appointmentData.date);
  });
  
  test('cancelAppointment should cancel an appointment', async () => {
    const appointmentId = 1;
    
    // Add a specific handler for this test
    server.use(
      rest.patch(`/api/appointments/${appointmentId}/cancel`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ success: true }));
      })
    );
    
    const result = await appointmentService.cancelAppointment(appointmentId);
    
    expect(result).toHaveProperty('success', true);
  });
}); 