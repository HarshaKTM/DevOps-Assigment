export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  specialization: string;
  dateTime: string;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AppointmentFormData {
  doctorId: number;
  doctorName?: string;
  specialization?: string;
  dateTime: string;
  duration?: number;
  notes?: string;
} 