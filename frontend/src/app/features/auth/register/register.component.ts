import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { AUTH_STRINGS } from '../strings';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
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

  strings = AUTH_STRINGS;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({ nombre: fullName, email, password }).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en el registro', err);
        this.error = err.error?.message || 'Error al registrar. Por favor, inténtelo de nuevo.';
      }
    });
  }

}
