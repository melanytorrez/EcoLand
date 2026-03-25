import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { FeatureFlags } from '../../../core/config/feature-flags.config';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent {
  currentPath = '';

  allNavItems = [
    { path: '/', label: 'Inicio', feature: null },
    { path: '/reforestacion', label: 'Reforestación', feature: 'reforestacion' },
    { path: '/campanas-reciclaje', label: 'Campañas de Reciclaje', feature: 'campanasReciclaje' },
    { path: '/reciclaje', label: 'Reciclaje', feature: 'reciclaje' },
    { path: '/estadisticas', label: 'Estadísticas', feature: 'estadisticas' },
  ];

  get navItems() {
    return this.allNavItems.filter(item => 
      !item.feature || this.featureFlagService.isFeatureEnabled(item.feature as keyof FeatureFlags)
    );
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get user(): any {
    return this.authService.getUser();
  }

  get isAdmin(): boolean {
    const u = this.user;
    return u && (u.role === 'Admin' || u.role === 'Administrador');
  }

  showLogoutModal = false;

  constructor(
    private router: Router, 
    private featureFlagService: FeatureFlagService,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects;
    });
  }

  logout() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
