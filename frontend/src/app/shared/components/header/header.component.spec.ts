import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth.service';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: string): string { return value; }
}

class RouterStub {
  url = '/';
  events = new BehaviorSubject<any>(null);
  navigate = jasmine.createSpy('navigate');
}

class TranslateServiceStub {
  currentLang = 'es';
  onLangChange = new Subject<any>();
  use = jasmine.createSpy('use');
}

class FeatureFlagServiceStub {
  features$ = new BehaviorSubject<any>({});
  isFeatureEnabled(): boolean { return true; }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: RouterStub;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUser', 'isAuthenticated', 'logout', 'normalizeRole'
    ]);
    authServiceSpy.getUser.and.returnValue(null);
    authServiceSpy.isAuthenticated.and.returnValue(false);
    authServiceSpy.normalizeRole.and.returnValue('usuario');

    router = new RouterStub();

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, FakeTranslatePipe],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceStub },
        { provide: Router, useValue: router },
        { provide: TranslateService, useClass: TranslateServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false for isAuthenticated when no user is logged in', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    expect(component.isAuthenticated).toBeFalse();
  });

  it('should return true for isAuthenticated when user is logged in', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    expect(component.isAuthenticated).toBeTrue();
  });

  it('should return null for user when no session exists', () => {
    authServiceSpy.getUser.and.returnValue(null);
    expect(component.user).toBeNull();
  });

  it('should return user data when a session exists', () => {
    const mockUser = { id: 1, nombre: 'Ana Verde', email: 'ana@eco.com', role: 'Usuario' };
    authServiceSpy.getUser.and.returnValue(mockUser);
    expect(component.user).toEqual(mockUser);
  });

  it('should identify admin user correctly', () => {
    authServiceSpy.getUser.and.returnValue({ nombre: 'Admin', role: 'ADMINISTRADOR' });
    authServiceSpy.normalizeRole.and.returnValue('admin');
    expect(component.isAdmin).toBeTrue();
  });

  it('should return false for isAdmin when user is not admin', () => {
    authServiceSpy.getUser.and.returnValue({ nombre: 'User', role: 'Usuario' });
    authServiceSpy.normalizeRole.and.returnValue('usuario');
    expect(component.isAdmin).toBeFalse();
  });

  it('should identify lider user correctly', () => {
    authServiceSpy.getUser.and.returnValue({ nombre: 'Líder', role: 'LIDER' });
    authServiceSpy.normalizeRole.and.returnValue('lider');
    expect(component.isLeader).toBeTrue();
  });

  it('should call logout and navigate to / when confirmLogout is called', () => {
    component.confirmLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set showLogoutModal to true when logout is called', () => {
    component.logout();
    expect(component.showLogoutModal).toBeTrue();
  });

  it('should set showLogoutModal to false when cancelLogout is called', () => {
    component.logout();
    component.cancelLogout();
    expect(component.showLogoutModal).toBeFalse();
  });
});
