import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { AUTH_STRINGS } from '../../../core/constants/strings.constants';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

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
export class RegisterComponent {

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

  strings = AUTH_STRINGS;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {
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

  passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      if (this.registerForm.hasError('mismatch')) {
        this.error = this.strings.errorPasswordMismatch;
      } else {
        this.error = this.strings.errorRequired;
      }
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.error = '';

    const { fullName, email, password, role } = this.registerForm.value;

    this.authService.register({ nombre: fullName, email, password, role }).subscribe({
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

        this.error = 'Error al registrar. Por favor, inténtelo de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }

}
