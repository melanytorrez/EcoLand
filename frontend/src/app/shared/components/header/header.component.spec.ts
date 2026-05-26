import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService, UserSession } from '../../../core/services/auth.service';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { Router } from '@angular/router';

class RouterStub {
  url = '/';
  events = new BehaviorSubject<any>(null);
  navigate = jasmine.createSpy('navigate');
}

class AuthServiceStub {
  private readonly userSubject = new BehaviorSubject<UserSession | null>(null);
  user$ = this.userSubject.asObservable();
  logout = jasmine.createSpy('logout').and.callFake(() => this.userSubject.next(null));

  setUser(user: UserSession | null): void {
    this.userSubject.next(user);
  }
}

class FeatureFlagServiceStub {
  isFeatureEnabled(): boolean {
    return true;
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthServiceStub;
  let router: RouterStub;

  beforeEach(async () => {
    authService = new AuthServiceStub();
    router = new RouterStub();

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceStub },
        { provide: Router, useValue: router }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login/register when user is not authenticated', () => {
    authService.setUser(null);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Iniciar sesi\u00f3n');
    expect(text).toContain('Registrarse');
    expect(text).not.toContain('Salir');
  });

  it('should show user name and logout when user is authenticated', () => {
    authService.setUser({ fullName: 'Ana Perez', email: 'ana@mail.com', role: 'Usuario' });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Ana Perez');
    expect(text).toContain('Salir');
    expect(text).not.toContain('Registrarse');
  });

  it('should show admin view button when authenticated user is admin', () => {
    authService.setUser({ fullName: 'Admin', email: 'admin@mail.com', role: 'Administrador' });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Vista Administrador');
  });

  it('should logout and navigate to home when clicking logout', () => {
    authService.setUser({ fullName: 'Ana Perez', email: 'ana@mail.com', role: 'Usuario' });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const logoutButton = Array.from(buttons).find((btn: any) =>
      (btn as HTMLButtonElement).textContent?.includes('Salir')
    ) as HTMLButtonElement;

    expect(logoutButton).toBeTruthy();

    logoutButton.click();
    fixture.detectChanges();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
