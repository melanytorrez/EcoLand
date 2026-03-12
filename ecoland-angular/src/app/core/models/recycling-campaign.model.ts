export interface RecyclingReward {
  rank: string;
  requirement: string;
  participants: number;
}

export interface RecyclingCampaign {
  id: number;
  image: string;
  name: string;
  wasteType: string;
  date: string;
  location: string;
  goal: string;
  collected: number;
  goalAmount: number;
  status: string;
  participants: number;
  typeColor: string;
  organizer?: string;
  organizerContact?: string;
  description?: string;
  benefits?: string[];
  rewards?: RecyclingReward[];
}
