import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EventEmitter, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';

@Pipe({ name: 'translate' })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateSpy: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'loginWithGoogle', 'setSession']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    translateSpy = {
      instant: (key: string) => key,
      get: () => of(''),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
      use: () => of('')
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateSpy }
      ]
    })
    .overrideComponent(RegisterComponent, {
      set: {
        imports: [ReactiveFormsModule, FakeTranslatePipe],
        schemas: [NO_ERRORS_SCHEMA]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emailRules getter', () => {
    it('should return hasAt=true when email contains @', () => {
      component.registerForm.get('email')!.setValue('user@test.com');
      expect(component.emailRules.hasAt).toBeTrue();
    });

    it('should return hasCom=true when email ends with .com', () => {
      component.registerForm.get('email')!.setValue('user@test.com');
      expect(component.emailRules.hasCom).toBeTrue();
    });
  });

  describe('passwordRules getter', () => {
    it('should detect minLength of 8 characters', () => {
      component.registerForm.get('password')!.setValue('Abc1@xxx');
      expect(component.passwordRules.minLength).toBeTrue();
    });

    it('should detect uppercase letter', () => {
      component.registerForm.get('password')!.setValue('Abc1@xxx');
      expect(component.passwordRules.hasUpper).toBeTrue();
    });

    it('should detect lowercase letter', () => {
      component.registerForm.get('password')!.setValue('Abc1@xxx');
      expect(component.passwordRules.hasLower).toBeTrue();
    });

    it('should detect number', () => {
      component.registerForm.get('password')!.setValue('Abc1@xxx');
      expect(component.passwordRules.hasNumber).toBeTrue();
    });

    it('should detect special character', () => {
      component.registerForm.get('password')!.setValue('Abc1@xxx');
      expect(component.passwordRules.hasSpecial).toBeTrue();
    });

    it('should return all false for empty password', () => {
      component.registerForm.get('password')!.setValue('');
      const rules = component.passwordRules;
      expect(rules.minLength).toBeFalse();
      expect(rules.hasUpper).toBeFalse();
    });
  });

  describe('passwordsMatch validator', () => {
    it('should return null when passwords match', () => {
      const fg = { get: (k: string) => ({ value: 'SamePass1@' }) } as any;
      expect(component.passwordsMatch(fg)).toBeNull();
    });

    it('should return {mismatch: true} when passwords do not match', () => {
      const fg = {
        get: (k: string) => k === 'password' ? { value: 'Pass1@' } : { value: 'Different1@' }
      } as any;
      expect(component.passwordsMatch(fg)).toEqual({ mismatch: true });
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle showPassword', () => {
      expect(component.showPassword).toBeFalse();
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTrue();
    });
  });

  describe('toggleConfirmPasswordVisibility', () => {
    it('should toggle showConfirmPassword', () => {
      expect(component.showConfirmPassword).toBeFalse();
      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    const validForm = () => {
      component.registerForm.setValue({
        fullName: 'John Doe',
        email: 'john@test.com',
        password: 'Password1@',
        confirmPassword: 'Password1@',
        role: 'Usuario'
      });
    };

    it('should show required error when form is invalid', () => {
      component.registerForm.setValue({ fullName: '', email: '', password: '', confirmPassword: '', role: 'Usuario' });
      component.onSubmit();
      expect(component.error).toBeTruthy();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });

    it('should show mismatch error when passwords differ', () => {
      component.registerForm.setValue({
        fullName: 'John',
        email: 'john@test.com',
        password: 'Password1@',
        confirmPassword: 'DifferentPass1@',
        role: 'Usuario'
      });
      component.onSubmit();
      expect(component.error).toContain('auth.register.validation.password_mismatch');
    });

    it('should call register and navigate to / on success', () => {
      validForm();
      authServiceSpy.register.and.returnValue(of({ token: 'tok' }));
      component.onSubmit();
      expect(authServiceSpy.register).toHaveBeenCalled();
      expect(authServiceSpy.setSession).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should show server error message when err.error.message exists', () => {
      validForm();
      authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Email already exists' } })));
      component.onSubmit();
      expect(component.error).toBe('Email already exists');
    });

    it('should show generic error on other failures', () => {
      validForm();
      authServiceSpy.register.and.returnValue(throwError(() => ({ error: 'Server error' })));
      component.onSubmit();
      expect(component.error).toBe('auth.register.messages.generic_error');
    });

    it('should not call register when isLoading is true', () => {
      validForm();
      component.isLoading = true;
      component.onSubmit();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });
  });

  describe('loginWithGoogle', () => {
    it('should navigate to / on Google auth success', () => {
      authServiceSpy.loginWithGoogle.and.returnValue(of({ token: 'g-tok' }));
      component.loginWithGoogle('google-credential');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set error on Google auth failure', () => {
      authServiceSpy.loginWithGoogle.and.returnValue(throwError(() => new Error('fail')));
      component.loginWithGoogle('bad-credential');
      expect(component.error).toBeTruthy();
    });
  });
});
