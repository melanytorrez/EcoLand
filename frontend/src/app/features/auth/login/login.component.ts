import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { AUTH_STRINGS } from '../strings';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterModule
  ],
  providers: [
    { provide: LucideAngularModule, useValue: LucideAngularModule.pick({ Leaf, Mail, Lock, User }) }
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  error = '';

  strings = AUTH_STRINGS;

  get emailRules() {
    const val = this.loginForm?.get('email')?.value || '';
    return {
      hasAt: val.includes('@'),
      hasCom: val.endsWith('.com')
    };
  }

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.com$/i)]],
      password: ['', Validators.required],
      role: ['Usuario']
    });

  }

  onSubmit() {

    if (this.loginForm.invalid) {
      this.error = this.strings.errorRequired;
      return;
    }

    const { email, password, role } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          this.authService.setToken(response.token);
        }
        
        if (role === 'Administrador' || this.authService.getUser()?.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        console.error('Error al iniciar sesión', err);
        this.error = 'Contraseña o Correo incorrectos intente de nuevo';
      }
    });

  }

}