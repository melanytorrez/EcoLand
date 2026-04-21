import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Campaign } from '../models/campaign.model';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = `${environment.apiUrl}/api/campaigns`;

  constructor(private http: HttpClient) { }

  getCampaigns(category?: string): Observable<Campaign[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Campaign[]>(this.apiUrl, { params });
  }

  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`);
  }

  participateInCampaign(id: number, token: string): Observable<Campaign> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<Campaign>(`${this.apiUrl}/${id}/participate`, {}, { headers });
  }

  createCampaign(campaign: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl, campaign, { headers });
  }

  updateCampaign(id: number, campaign: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, campaign, { headers });
  }

  deleteCampaign(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
