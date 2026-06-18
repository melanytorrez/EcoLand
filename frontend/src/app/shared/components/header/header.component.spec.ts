import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth.service';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let featureFlagServiceSpy: jasmine.SpyObj<FeatureFlagService>;
  let routerStub: any;
  let translateSpy: any;
  const featuresSubject = new BehaviorSubject<any>({});

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated', 'getUser', 'normalizeRole', 'logout'
    ]);
    featureFlagServiceSpy = jasmine.createSpyObj('FeatureFlagService', ['isFeatureEnabled']);
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(true);
    (featureFlagServiceSpy as any).features$ = featuresSubject.asObservable();

    authServiceSpy.isAuthenticated.and.returnValue(false);
    authServiceSpy.getUser.and.returnValue(null);
    authServiceSpy.normalizeRole.and.returnValue('usuario');

    routerStub = {
      url: '/test',
      navigate: jasmine.createSpy('navigate'),
      events: new BehaviorSubject(new NavigationEnd(1, '/test', '/test'))
    };

    translateSpy = {
      instant: (key: string) => key,
      get: (key: string) => new BehaviorSubject(key).asObservable(),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
      currentLang: 'es',
      use: jasmine.createSpy('use')
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: FeatureFlagService, useValue: featureFlagServiceSpy },
        { provide: Router, useValue: routerStub },
        { provide: TranslateService, useValue: translateSpy }
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

  describe('isAuthenticated getter', () => {
    it('should return false when user is not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      expect(component.isAuthenticated).toBeFalse();
    });

    it('should return true when user is authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      expect(component.isAuthenticated).toBeTrue();
    });
  });

  describe('isAdmin getter', () => {
    it('should return true for admin user', () => {
      authServiceSpy.getUser.and.returnValue({ role: 'ADMINISTRADOR' });
      authServiceSpy.normalizeRole.and.returnValue('admin');
      expect(component.isAdmin).toBeTrue();
    });

    it('should return false for regular user', () => {
      authServiceSpy.getUser.and.returnValue({ role: 'USUARIO' });
      authServiceSpy.normalizeRole.and.returnValue('usuario');
      expect(component.isAdmin).toBeFalse();
    });

    it('should return false when no user', () => {
      authServiceSpy.getUser.and.returnValue(null);
      expect(component.isAdmin).toBeFalsy();
    });
  });

  describe('isLeader getter', () => {
    it('should return true for lider role', () => {
      authServiceSpy.getUser.and.returnValue({ role: 'LIDER' });
      authServiceSpy.normalizeRole.and.returnValue('lider');
      expect(component.isLeader).toBeTrue();
    });

    it('should return false for non-leader', () => {
      authServiceSpy.getUser.and.returnValue({ role: 'USUARIO' });
      authServiceSpy.normalizeRole.and.returnValue('usuario');
      expect(component.isLeader).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should set showLogoutModal to true', () => {
      component.logout();
      expect(component.showLogoutModal).toBeTrue();
    });
  });

  describe('confirmLogout', () => {
    it('should call authService.logout and navigate to /', () => {
      component.confirmLogout();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set showLogoutModal to false', () => {
      component.showLogoutModal = true;
      component.confirmLogout();
      expect(component.showLogoutModal).toBeFalse();
    });
  });

  describe('cancelLogout', () => {
    it('should set showLogoutModal to false', () => {
      component.showLogoutModal = true;
      component.cancelLogout();
      expect(component.showLogoutModal).toBeFalse();
    });
  });

  describe('switchLanguage', () => {
    it('should call translate.use for valid language', () => {
      component.switchLanguage('en');
      expect(translateSpy.use).toHaveBeenCalledWith('en');
    });

    it('should do nothing for invalid language code', () => {
      component.switchLanguage('xx-invalid');
      expect(translateSpy.use).not.toHaveBeenCalled();
    });

    it('should close langOpen after switching', () => {
      component.langOpen = true;
      component.switchLanguage('es');
      expect(component.langOpen).toBeFalse();
    });
  });

  describe('currentLanguage getter', () => {
    it('should return language object matching currentLang', () => {
      component.currentLang = 'es';
      const lang = component.currentLanguage;
      expect(lang.code).toBe('es');
    });
  });
});
