import { Component, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  currentPath = '';
  currentLang = 'es';
  showLogoutModal = false;
  langOpen = false;

  languages = [
    { code: 'es', label: 'Español',   flag: '🇧🇴' },
    { code: 'en', label: 'English',   flag: '🇬🇧' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  ];

  allNavItems = [
    { path: '/',              label: 'header.nav.home',          feature: null },
    { path: '/reforestacion', label: 'header.nav.reforestation', feature: 'reforestacion' },
    { path: '/reciclaje',     label: 'header.nav.recycling',     feature: 'reciclaje' },
    { path: '/estadisticas',  label: 'header.nav.stats',         feature: 'estadisticas' },
  ];

  constructor(
    private router: Router,
    private featureFlagService: FeatureFlagService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    const savedLang = localStorage.getItem('ecoland_lang') || 'es';
    this.currentLang = savedLang;
    this.translate.use(savedLang);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    this.currentPath = this.router.url;
  }

  get currentLanguage() {
    return this.languages.find(l => l.code === this.currentLang) ?? this.languages[0];
  }

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
    localStorage.setItem('ecoland_lang', lang);
  }
}