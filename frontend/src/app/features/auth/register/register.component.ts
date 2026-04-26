import { Component, ChangeDetectorRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterModule,
    TranslateModule
  ],
  providers: [
    { provide: LucideAngularModule, useValue: LucideAngularModule.pick({ Leaf, Mail, Lock, User }) }
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  error = '';
  isLoading = false;

  get emailRules() {
    const val = this.registerForm?.get('email')?.value || '';
    return {
      hasAt: val.includes('@'),
      hasCom: val.endsWith('.com')
    };
  }

  get passwordRules() {
    const val = this.registerForm?.get('password')?.value || '';
    return {
      minLength: val.length >= 8,
      hasUpper: /[A-Z]/.test(val),
      hasLower: /[a-z]/.test(val),
      hasNumber: /[0-9]/.test(val),
      hasSpecial: /[@#$%^&+=!.*_\-]/.test(val)
    };
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private ngZone: NgZone
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.com$/i)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*_\-]).{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      role: ['Usuario']
    }, {
      validators: this.passwordsMatch
    });
  }

  ngOnInit(): void {
    this.renderGoogleButton();
  }

  ngOnDestroy(): void {
  }

  private renderGoogleButton(): void {
    const googleApi = (window as any)['google'];
    if (googleApi?.accounts?.id) {
      googleApi.accounts.id.initialize({
        client_id: '453422657382-mpgsm4p398f0s54848p4uhmrop3uueu6.apps.googleusercontent.com',
        callback: (response: any) => {
          this.ngZone.run(() => {
            if (response?.credential) {
              this.loginWithGoogle(response.credential);
            }
          });
        }
      });
      const btnContainer = document.getElementById('google-signin-btn-register');
      if (btnContainer) {
        googleApi.accounts.id.renderButton(btnContainer, {
          type: 'standard',
          size: 'large',
          theme: 'outline',
          text: 'signin_with',
          width: 350
        });
      }
    } else {
      setTimeout(() => this.renderGoogleButton(), 500);
    }
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      if (this.registerForm.hasError('mismatch')) {
        this.error = this.translate.instant('auth.register.validation.password_mismatch');
      } else {
        this.error = this.translate.instant('auth.register.validation.required');
      }
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.error = '';

    const { fullName, email, password, role } = this.registerForm.value;

    this.authService.register({
      nombre: fullName,
      email,
      password,
      role
    }).subscribe({
      next: (response: any) => {
        console.log('Registro exitoso', response);
        this.authService.setSession(response);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Error en el registro', err);
        this.isLoading = false;

        if (err?.error?.message) {
          this.error = err.error.message;
          this.cdr.detectChanges();
          return;
        }

        if (err?.error && typeof err.error === 'object') {
          const firstValidationMessage = Object.values(err.error)[0];
          if (typeof firstValidationMessage === 'string') {
            this.error = firstValidationMessage;
            this.cdr.detectChanges();
            return;
          }
        }

        this.error = this.translate.instant('auth.register.messages.generic_error');
        this.cdr.detectChanges();
      }
    });
  }

  loginWithGoogle(idToken: string) {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = '';

    this.authService.loginWithGoogle(idToken).subscribe({
      next: (response: any) => {
        this.authService.setSession(response);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Error registrando/iniciando con Google', err);
        this.isLoading = false;
        this.error = 'Error autenticando con Google. Intente de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }
}
