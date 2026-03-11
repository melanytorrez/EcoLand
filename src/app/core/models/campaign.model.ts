export interface Campaign {
  id: number;
  image: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  spots: number;
  participants: number;
  organizer: string;
  organizerContact?: string;
  status: string;
  description?: string;
  requirements?: string[];
}
