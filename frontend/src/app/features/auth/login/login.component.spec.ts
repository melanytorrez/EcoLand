import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { of, throwError } from 'rxjs';
import { EventEmitter } from '@angular/core';

import { LoginComponent } from './login.component';

@Pipe({ name: 'translate' })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateSpy: any;

  const mockActivatedRoute = {
    snapshot: {
      queryParamMap: {
        get: (key: string) => {
          if (key === 'redirectTo') return '';
          if (key === 'message') return '';
          return null;
        }
      }
    }
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login', 'loginWithGoogle', 'setSession', 'normalizeRole', 'isAuthenticated'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    translateSpy = {
      instant: (key: string) => key,
      get: () => of(''),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
      use: () => of('')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TranslateService, useValue: translateSpy }
      ]
    })
    .overrideComponent(LoginComponent, {
      set: {
        imports: [ReactiveFormsModule, FakeTranslatePipe],
        schemas: [NO_ERRORS_SCHEMA]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emailRules getter', () => {
    it('should detect @ in email', () => {
      component.loginForm.get('email')!.setValue('user@test.com');
      expect(component.emailRules.hasAt).toBeTrue();
    });

    it('should detect .com in email', () => {
      component.loginForm.get('email')!.setValue('user@test.com');
      expect(component.emailRules.hasCom).toBeTrue();
    });

    it('should return false for invalid email', () => {
      component.loginForm.get('email')!.setValue('invalid');
      expect(component.emailRules.hasAt).toBeFalse();
      expect(component.emailRules.hasCom).toBeFalse();
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle showPassword from false to true', () => {
      expect(component.showPassword).toBeFalse();
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTrue();
    });

    it('should toggle showPassword back to false', () => {
      component.showPassword = true;
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    it('should set error and not call login when form is invalid', () => {
      component.loginForm.setValue({ email: '', password: '' });
      component.onSubmit();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
      expect(component.error).toBeTruthy();
    });

    it('should not call login when isLoading is true', () => {
      component.loginForm.setValue({ email: 'test@test.com', password: 'pass' });
      component.isLoading = true;
      component.onSubmit();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should navigate to /admin when role is admin after success', () => {
      authServiceSpy.login.and.returnValue(of({ token: 'tok', role: 'ADMINISTRADOR' }));
      authServiceSpy.normalizeRole.and.returnValue('admin');
      component.loginForm.setValue({ email: 'admin@test.com', password: 'Password1!' });
      component.onSubmit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
    });

    it('should navigate to / when role is usuario after success', () => {
      authServiceSpy.login.and.returnValue(of({ token: 'tok', role: 'USUARIO' }));
      authServiceSpy.normalizeRole.and.returnValue('usuario');
      component.loginForm.setValue({ email: 'user@test.com', password: 'Password1!' });
      component.onSubmit();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should set error and isLoading=false on HTTP error', () => {
      authServiceSpy.login.and.returnValue(throwError(() => new Error('401')));
      component.loginForm.setValue({ email: 'user@test.com', password: 'Password1!' });
      component.onSubmit();
      expect(component.error).toBeTruthy();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('loginWithGoogle', () => {
    it('should call authService.loginWithGoogle with idToken', () => {
      authServiceSpy.loginWithGoogle.and.returnValue(of({ token: 'google-tok', role: 'USUARIO' }));
      authServiceSpy.normalizeRole.and.returnValue('usuario');
      component.loginWithGoogle('google-id-token');
      expect(authServiceSpy.loginWithGoogle).toHaveBeenCalledWith('google-id-token');
    });

    it('should set error and isLoading=false on Google auth error', () => {
      authServiceSpy.loginWithGoogle.and.returnValue(throwError(() => new Error('Google error')));
      component.loginWithGoogle('bad-token');
      expect(component.error).toBeTruthy();
      expect(component.isLoading).toBeFalse();
    });

    it('should not call loginWithGoogle when isLoading is true', () => {
      component.isLoading = true;
      component.loginWithGoogle('token');
      expect(authServiceSpy.loginWithGoogle).not.toHaveBeenCalled();
    });
  });
});
