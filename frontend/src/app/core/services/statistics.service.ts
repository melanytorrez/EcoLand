import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { environment } from '../../../environments/environment';

export interface QuickStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalParticipants: number;
}

export interface EnvironmentalImpact {
  completedCampaigns: number;
  plantedTrees: number;
  mitigatedCo2Kg: number;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface ResidueData {
  type: string;
  amount: number;
}

export interface ZoneActivity {
  zone: string;
  activities: number;
}

export interface MonthlyVolunteer {
  month: string;
  totalVolunteers: number;
}

export interface ComprehensiveStatistics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalParticipants: number;
  completedCampaigns: number;
  plantedTrees: number;
  mitigatedCo2Kg: number;
  monthlyPlantedTrees: MonthlyData[];
  residueDistribution: ResidueData[];
  zoneActivity: ZoneActivity[];
  volunteerGrowth: MonthlyVolunteer[];
  waterSavedLiters: number;
  forestAreaHectares: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/api/statistics`;

  constructor(private http: HttpClient) {}

  getQuickStats(): Observable<QuickStats> {
    return this.http.get<QuickStats>(`${this.apiUrl}/quick`);
  }

  getEnvironmentalImpact(): Observable<EnvironmentalImpact> {
    return this.http.get<EnvironmentalImpact>(`${this.apiUrl}/environmental-impact`);
  }

  getComprehensiveStatistics(): Observable<ComprehensiveStatistics> {
    return this.http.get<ComprehensiveStatistics>(`${this.apiUrl}/comprehensive`);
  }

  getCampaignParticipants(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${environment.apiUrl}/api/campaigns`);
  }
}

