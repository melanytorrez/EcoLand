import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserSession {
  fullName: string;
  email: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly sessionStorageKey = 'ecoland_session';
  private readonly userSubject = new BehaviorSubject<UserSession | null>(this.loadSession());

  readonly user$ = this.userSubject.asObservable();
  readonly isAuthenticated$ = this.user$.pipe(map(user => !!user));

  constructor() {}

  get currentUser(): UserSession | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  login(user: UserSession): void {
    this.userSubject.next(user);
    localStorage.setItem(this.sessionStorageKey, JSON.stringify(user));
  }

  register(user: UserSession): void {
    this.login(user);
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem(this.sessionStorageKey);
  }

  private loadSession(): UserSession | null {
    const rawSession = localStorage.getItem(this.sessionStorageKey);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as UserSession;
    } catch {
      localStorage.removeItem(this.sessionStorageKey);
      return null;
    }
  }
}
