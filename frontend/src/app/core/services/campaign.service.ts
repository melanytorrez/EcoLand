import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Campaign } from '../models/campaign.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly apiUrl = 'http://localhost:8082/api/v1/campaigns';

  constructor(private http: HttpClient) { }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.apiUrl);
  }

  getCampaignById(id: number): Observable<Campaign | undefined> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`);
  }

  participateInCampaign(id: number, token: string): Observable<Campaign> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<Campaign>(`${this.apiUrl}/${id}/participate`, {}, { headers });
  }
}
