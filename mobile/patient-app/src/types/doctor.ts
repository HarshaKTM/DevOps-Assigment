export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  qualifications: string;
  yearsOfExperience: number;
  avatar: string;
  bio: string;
  availability: {
    monday?: DailyAvailability;
    tuesday?: DailyAvailability;
    wednesday?: DailyAvailability;
    thursday?: DailyAvailability;
    friday?: DailyAvailability;
    saturday?: DailyAvailability;
    sunday?: DailyAvailability;
  };
}

export interface DailyAvailability {
  start: string; // Format: "HH:MM"
  end: string; // Format: "HH:MM"
}

export interface DoctorAvailability {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorSpecialization {
  id: number;
  name: string;
  description: string;
  iconName: string;
} 