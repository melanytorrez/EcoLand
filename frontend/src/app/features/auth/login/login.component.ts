import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { AUTH_STRINGS } from '../strings';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
        console.log('Login exitoso', response);
        // La redirección depende del rol que haya seleccionado el usuario o el que venga del BE
        // Por ahora mantenemos la lógica de navegación basada en el formulario
        if (role === 'Administrador') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        console.error('Error en el login', err);
        this.error = 'Credenciales inválidas. Por favor, intente de nuevo.';
      }
    });

  }

}