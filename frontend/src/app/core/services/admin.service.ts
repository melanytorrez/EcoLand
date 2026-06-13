import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { VolunteerApplication, VolunteerApplicationStatus } from '../models/volunteer-application.model';
import { RecyclingActivity, RecyclingActivityStatus } from '../models/recycling.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/v1/admin`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getPendingLeaderRequests(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/leader-requests`, { headers: this.getHeaders() });
  }

  approveLeaderRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/leader-requests/${userId}/approve`, {}, { headers: this.getHeaders() });
  }

  rejectLeaderRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/leader-requests/${userId}/reject`, {}, { headers: this.getHeaders() });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    // Maps to /api/v1/usuarios (which requires login/is own context, but we will call as Admin or add admin endpoint if required)
    // To remain fully safe, let's map to /api/v1/usuarios/me or generic /api/v1/usuarios if we expose it
    return this.http.post<any>(`${environment.apiUrl}/api/v1/usuarios`, user, { headers });
  }

  deleteUser(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete<any>(`${environment.apiUrl}/api/v1/usuarios/${id}`, { headers });
  }

  getVolunteerApplicationsByStatus(status: VolunteerApplicationStatus = 'PENDING'): Observable<VolunteerApplication[]> {
    return this.http.get<VolunteerApplication[]>(`${this.apiUrl}/volunteer-applications`, {
      headers: this.getHeaders(),
      params: { status }
    });
  }

  approveVolunteerApplication(applicationId: number): Observable<VolunteerApplication> {
    return this.http.post<VolunteerApplication>(
      `${this.apiUrl}/volunteer-applications/${applicationId}/approve`,
      {},
      { headers: this.getHeaders() }
    );
  }

  rejectVolunteerApplication(applicationId: number, adminNotes: string): Observable<VolunteerApplication> {
    return this.http.post<VolunteerApplication>(
      `${this.apiUrl}/volunteer-applications/${applicationId}/reject`,
      {},
      {
        headers: this.getHeaders(),
        params: { adminNotes }
      }
    );
  }

  getRecyclingActivitiesByStatus(status: RecyclingActivityStatus = 'PENDING'): Observable<RecyclingActivity[]> {
    return this.http.get<RecyclingActivity[]>(`${this.apiUrl}/recycling-activities`, {
      headers: this.getHeaders(),
      params: { status }
    });
  }

  approveRecyclingActivity(activityId: number): Observable<RecyclingActivity> {
    return this.http.post<RecyclingActivity>(
      `${this.apiUrl}/recycling-activities/${activityId}/approve`,
      {},
      { headers: this.getHeaders() }
    );
  }

  rejectRecyclingActivity(activityId: number, adminNotes: string): Observable<RecyclingActivity> {
    return this.http.post<RecyclingActivity>(
      `${this.apiUrl}/recycling-activities/${activityId}/reject`,
      {},
      {
        headers: this.getHeaders(),
        params: { adminNotes }
      }
    );
  }
}
