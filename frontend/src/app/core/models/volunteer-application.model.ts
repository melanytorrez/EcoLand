export type VolunteerApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface VolunteerApplication {
  id?: number;
  campaignId: number;
  usuarioEmail?: string;
  fullName: string;
  age: number;
  phone: string;
  availableWeekends: boolean;
  hasEnvironmentalExperience: boolean;
  experienceDetails?: string;
  motivation: string;
  availabilityHours: string;
  status?: VolunteerApplicationStatus;
  fechaPostulacion?: string;
  adminNotes?: string;
}