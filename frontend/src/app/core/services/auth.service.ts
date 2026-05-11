import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  loginWithGoogle(tokenId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, { tokenId });
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setSession(response: any): void {
    if (response?.token) {
      this.setToken(response.token);
    }

    if (response?.nombre || response?.email) {
      localStorage.setItem(this.userKey, JSON.stringify({
        id: response.id,
        nombre: response.nombre,
        email: response.email,
        role: response.role,
        promotionStatus: response.promotionStatus || response.estadoSolicitud
      }));
    }
  }

  updateUser(user: any): void {
    const currentUser = this.getUser() || {};
    const updatedUser = { ...currentUser, ...user };
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
  }

  normalizeRole(role: string | undefined | null): 'admin' | 'lider' | 'usuario' {
    const value = (role || '').toUpperCase();
    if (value.includes('ADMIN')) return 'admin';
    if (value.includes('LIDER')) return 'lider';
    return 'usuario';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getUser(): any {
    const savedUser = localStorage.getItem(this.userKey);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem(this.userKey);
      }
    }

    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(normalizedPayload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Error decoding JWT Token', e);
      return null;
    }
  }
}
