import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { VolunteerApplication, VolunteerApplicationStatus } from '../models/volunteer-application.model';

@Injectable({
  providedIn: 'root'
})
export class VolunteerApplicationService {
  private apiUrl = `${environment.apiUrl}/api/v1/volunteer-applications`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders | undefined {
    const token = this.authService.getToken();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  apply(application: VolunteerApplication): Observable<VolunteerApplication> {
    const headers = this.getHeaders();
    return this.http.post<VolunteerApplication>(this.apiUrl, application, headers ? { headers } : {});
  }

  getByCampaign(campaignId: number): Observable<VolunteerApplication[]> {
    const headers = this.getHeaders();
    return this.http.get<VolunteerApplication[]>(`${this.apiUrl}/campaign/${campaignId}`, headers ? { headers } : {});
  }

  getMyApplication(campaignId: number): Observable<VolunteerApplication> {
    const headers = this.getHeaders();
    return this.http.get<VolunteerApplication>(`${this.apiUrl}/campaign/${campaignId}/me`, headers ? { headers } : {});
  }
}