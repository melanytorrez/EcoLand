import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { AUTH_STRINGS } from '../../../core/constants/strings.constants';
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
  infoMessage = '';
  redirectTo = '';

  strings = AUTH_STRINGS;

  get emailRules() {
    const val = this.loginForm?.get('email')?.value || '';
    return {
      hasAt: val.includes('@'),
      hasCom: val.endsWith('.com')
    };
  }

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.com$/i)]],
      password: ['', Validators.required],
      role: ['Usuario']
    });

    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '';
    this.infoMessage = this.route.snapshot.queryParamMap.get('message') || '';

  }

  isLoading = false;

  onSubmit() {

    if (this.loginForm.invalid) {
      this.error = this.strings.errorRequired;
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.error = '';

    const { email, password, role } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        this.authService.setSession(response);

        const selectedRole = role === 'Administrador' ? 'admin' : 'usuario';
        const actualRole = this.authService.normalizeRole(response?.role);

        if (selectedRole !== actualRole) {
          this.authService.logout();
          this.error = selectedRole === 'admin'
            ? 'Tu cuenta no tiene permisos de administrador.'
            : 'Tu cuenta es de administrador. Elige el acceso de administrador.';
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        
        if (actualRole === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigateByUrl(this.redirectTo || '/');
        }
      },
      error: (err: any) => {
        console.error('Error al iniciar sesión', err);
        this.isLoading = false;
        this.error = 'Contraseña o Correo incorrectos intente de nuevo';
        this.cdr.detectChanges();
      }
    });

  }

}