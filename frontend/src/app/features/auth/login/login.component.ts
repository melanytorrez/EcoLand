import { Component, ChangeDetectorRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  error = '';
  infoMessage = '';
  redirectTo = '';
  isLoading = false;

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
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.com$/i)]],
      password: ['', Validators.required],
      role: ['Usuario']
    });

    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '';
    this.infoMessage = this.route.snapshot.queryParamMap.get('message') || '';
  }

  ngOnInit(): void {
    this.renderGoogleButton();
  }

  ngOnDestroy(): void {}

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
      const btnContainer = document.getElementById('google-signin-btn-login');
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
      // Google API not loaded yet, retry after a short delay
      setTimeout(() => this.renderGoogleButton(), 500);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.error = this.translate.instant('auth.register.validation.required');
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
            ? this.translate.instant('auth.login.errors.no_admin_permissions')
            : this.translate.instant('auth.login.errors.admin_account_required');
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
        this.error = this.translate.instant('auth.login.errors.invalid_credentials');
        this.cdr.detectChanges();
      }
    });
  }

  loginWithGoogle(idToken: string) {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = '';

    const role = this.loginForm.get('role')?.value;

    this.authService.loginWithGoogle(idToken).subscribe({
      next: (response: any) => {
        this.authService.setSession(response);

        const actualRole = this.authService.normalizeRole(response?.role);

        if (actualRole === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigateByUrl(this.redirectTo || '/');
        }
      },
      error: (err: any) => {
        console.error('Error al iniciar sesión con Google', err);
        this.isLoading = false;
        this.error = 'Error autenticando con Google. Intente de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }
}