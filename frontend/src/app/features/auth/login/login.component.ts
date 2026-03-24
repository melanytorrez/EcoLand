import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    LucideAngularModule
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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {

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

    const { role, email } = this.loginForm.value;

    this.authService.login({
      fullName: email,
      email,
      role
    });

    if (role === 'Administrador') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }

  }

}