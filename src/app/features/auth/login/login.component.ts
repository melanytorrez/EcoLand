import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_STRINGS } from '../strings';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  error = '';

  strings = AUTH_STRINGS;

  constructor(private fb: FormBuilder, private router: Router) {

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

    const { role } = this.loginForm.value;

    if (role === 'Administrador') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }

  }

}