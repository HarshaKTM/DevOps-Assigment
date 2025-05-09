import { Appointment } from '../../services/appointmentService';

// Generate dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setDate(lastMonth.getDate() - 30);

export const mockAppointments: Appointment[] = [
  // Upcoming appointments
  {
    id: 1,
    patientId: 101,
    doctorId: 1,
    date: tomorrow.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    status: 'scheduled',
    type: 'regular',
    reason: 'Annual physical examination',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString()
  },
  {
    id: 2,
    patientId: 101,
    doctorId: 2,
    date: nextWeek.toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '14:30',
    status: 'scheduled',
    type: 'follow-up',
    reason: 'Follow-up on blood test results',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString()
  },
  {
    id: 3,
    patientId: 101,
    doctorId: 3,
    date: nextWeek.toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '11:30',
    status: 'scheduled',
    type: 'consultation',
    reason: 'Skin rash consultation',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString()
  },
  
  // Past appointments
  {
    id: 101,
    patientId: 101,
    doctorId: 1,
    date: lastWeek.toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '10:30',
    status: 'completed',
    type: 'regular',
    reason: 'Flu symptoms',
    notes: 'Patient prescribed antibiotics and advised to rest',
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString()
  },
  {
    id: 102,
    patientId: 101,
    doctorId: 4,
    date: lastMonth.toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '13:30',
    status: 'completed',
    type: 'regular',
    reason: 'Headache and dizziness',
    notes: 'Referred to neurologist for further testing',
    createdAt: lastMonth.toISOString(),
    updatedAt: lastMonth.toISOString()
  },
  {
    id: 103,
    patientId: 101,
    doctorId: 2,
    date: lastMonth.toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '15:30',
    status: 'cancelled',
    type: 'follow-up',
    reason: 'Follow-up on medication',
    createdAt: lastMonth.toISOString(),
    updatedAt: lastMonth.toISOString()
  },
  {
    id: 104,
    patientId: 101,
    doctorId: 5,
    date: lastWeek.toISOString().split('T')[0],
    startTime: '09:30',
    endTime: '10:00',
    status: 'no-show',
    type: 'regular',
    reason: 'Yearly check-up',
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString()
  }
]; 