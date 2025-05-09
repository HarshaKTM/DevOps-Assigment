export interface MedicalRecord {
  id: number;
  patientId: number;
  title: string;
  recordType: 'examination' | 'vaccination' | 'consultation' | 'prescription' | 'lab' | 'other';
  date: string;
  doctorId: number;
  doctorName: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface MedicalRecordSummary {
  id: number;
  title: string;
  recordType: string;
  date: string;
  doctorName: string;
  hasAttachments: boolean;
} 