export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address: Address;
  emergencyContact: EmergencyContact;
  insurance: Insurance;
  medicalHistory: MedicalHistory;
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address: Address;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  primary: boolean;
}

export interface MedicalHistory {
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  pastSurgeries: Surgery[];
  familyHistory: FamilyHistory;
}

export interface Surgery {
  procedure: string;
  year: number;
  notes?: string;
}

export interface FamilyHistory {
  heartDisease: boolean;
  diabetes: boolean;
  cancer: boolean;
  other?: string[];
} 