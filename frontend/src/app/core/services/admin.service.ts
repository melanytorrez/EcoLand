import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

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
}
