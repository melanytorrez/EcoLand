import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap(response => this.setSession(response))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  private setSession(authResult: any): void {
    if (authResult && authResult.token) {
      localStorage.setItem(this.TOKEN_KEY, authResult.token);
      localStorage.setItem('user_email', authResult.email);
      localStorage.setItem('user_name', authResult.nombre);
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    // Aquí se podría añadir lógica para verificar si el token ha expirado
    return !!token;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getUser(): any {
    if (this.isAuthenticated()) {
      return {
        email: localStorage.getItem('user_email'),
        nombre: localStorage.getItem('user_name')
      };
    }
    return null;
  }
}
