import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/v1/usuarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMyParticipations(): Observable<Campaign[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Campaign[]>(`${this.apiUrl}/me/participations`, { headers });
  }
}
