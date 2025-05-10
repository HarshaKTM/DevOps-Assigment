import { Appointment } from '../../store/slices/appointmentSlice';
import { addDays, format } from 'date-fns';

// Generate dates for the next 7 days
const todayDate = new Date();
const appointmentDates = Array(7)
  .fill(null)
  .map((_, index) => format(addDays(todayDate, index), 'yyyy-MM-dd'));

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    doctorId: 3,
    date: appointmentDates[0],
    startTime: '09:00',
    endTime: '09:30',
    type: 'consultation',
    status: 'scheduled',
    reason: 'Annual checkup to monitor heart condition',
    notes: 'Patient reports feeling well. No significant changes since last visit.',
    createdAt: '2023-04-01T12:00:00Z',
    updatedAt: '2023-04-01T12:00:00Z'
  },
  {
    id: 2,
    patientId: 2,
    doctorId: 1,
    date: appointmentDates[1],
    startTime: '14:00',
    endTime: '14:30',
    type: 'follow-up',
    status: 'scheduled',
    reason: 'Follow-up on recent lab results and medication adjustment',
    notes: '',
    createdAt: '2023-04-02T10:00:00Z',
    updatedAt: '2023-04-02T10:00:00Z'
  },
  {
    id: 3,
    patientId: 3,
    doctorId: 2,
    date: appointmentDates[2],
    startTime: '11:00',
    endTime: '11:30',
    type: 'emergency',
    status: 'completed',
    reason: 'Severe pain in lower abdomen, suspected appendicitis',
    notes: 'Referred to emergency department for immediate assessment.',
    createdAt: '2023-04-03T08:00:00Z',
    updatedAt: '2023-04-03T09:30:00Z'
  },
  {
    id: 4,
    patientId: 1,
    doctorId: 4,
    date: appointmentDates[3],
    startTime: '10:00',
    endTime: '10:30',
    type: 'consultation',
    status: 'cancelled',
    reason: 'Skin rash and itching on arms',
    notes: 'Patient cancelled due to scheduling conflict.',
    createdAt: '2023-04-04T14:00:00Z',
    updatedAt: '2023-04-05T09:00:00Z'
  },
  {
    id: 5,
    patientId: 2,
    doctorId: 5,
    date: appointmentDates[4],
    startTime: '15:00',
    endTime: '15:30',
    type: 'follow-up',
    status: 'scheduled',
    reason: 'Review of physical therapy progress',
    notes: '',
    createdAt: '2023-04-05T11:00:00Z',
    updatedAt: '2023-04-05T11:00:00Z'
  },
  {
    id: 6,
    patientId: 4,
    doctorId: 2,
    date: appointmentDates[0],
    startTime: '13:30',
    endTime: '14:00',
    type: 'consultation',
    status: 'scheduled',
    reason: 'Persistent headaches and dizziness',
    notes: 'Patient to bring previous imaging results.',
    createdAt: '2023-04-06T10:00:00Z',
    updatedAt: '2023-04-06T10:00:00Z'
  },
  {
    id: 7,
    patientId: 3,
    doctorId: 1,
    date: appointmentDates[5],
    startTime: '09:30',
    endTime: '10:00',
    type: 'follow-up',
    status: 'scheduled',
    reason: 'Blood pressure monitoring and medication review',
    notes: '',
    createdAt: '2023-04-07T09:00:00Z',
    updatedAt: '2023-04-07T09:00:00Z'
  },
  {
    id: 8,
    patientId: 5,
    doctorId: 3,
    date: appointmentDates[1],
    startTime: '16:00',
    endTime: '16:30',
    type: 'consultation',
    status: 'scheduled',
    reason: 'New patient consultation for heart palpitations',
    notes: 'Patient has family history of heart disease.',
    createdAt: '2023-04-08T14:00:00Z',
    updatedAt: '2023-04-08T14:00:00Z'
  }
];

export default mockAppointments; 