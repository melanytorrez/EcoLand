import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { FeatureFlags } from '../../../core/config/feature-flags.config';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent {
  currentPath = '';
  currentLang = 'es';

  allNavItems = [
    { path: '/', label: 'navigation.home', feature: null },
    { path: '/reforestacion', label: 'navigation.reforestation', feature: 'reforestacion' },
    { path: '/campanas-reciclaje', label: 'navigation.campaigns', feature: 'campanasReciclaje' },
    { path: '/reciclaje', label: 'navigation.recycling', feature: 'reciclaje' },
    { path: '/estadisticas', label: 'navigation.stats', feature: 'estadisticas' },
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
    private authService: AuthService,
    private translate: TranslateService
  ) {
    // Sincronizar el indicador visual con el idioma activo (guardado en localStorage)
    this.currentLang = localStorage.getItem('ecoland_lang') || 'es';
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

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    // Persistir preferencia del usuario
    localStorage.setItem('ecoland_lang', lang);
  }
}
