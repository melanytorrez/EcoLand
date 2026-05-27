import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { FeatureFlags } from '../../../core/config/feature-flags.config';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SUPPORTED_LANGUAGES } from '../../../core/config/languages.config';

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

  languages = SUPPORTED_LANGUAGES;

  allNavItems = [
    { path: '/',              label: 'header.nav.home',          feature: 'inicio' },
    { path: '/reforestacion', label: 'header.nav.reforestation', feature: 'reforestacion' },
    { path: '/reciclaje',     label: 'header.nav.recycling',     feature: 'reciclaje' },
    { path: '/estadisticas',  label: 'header.nav.stats',         feature: 'estadisticas' },
    { path: '/admin/campanas', label: 'header.nav.my_publications', feature: 'reforestacion', role: 'lider' },
  ];

  constructor(
    private router: Router,
    private featureFlagService: FeatureFlagService,
    private authService: AuthService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializar idioma desde el servicio o storage
    this.currentLang = this.translate.currentLang || localStorage.getItem('ecoland_lang') || 'es';
  }

  ngOnInit(): void {
    this.currentPath = this.router.url;

    // Suscribirse a cambios de navegación para actualizar path y forzar renderizado
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects;
      this.cdr.detectChanges();
    });

    // Suscribirse a cambios de idioma
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.cdr.detectChanges();
    });

    // Suscribirse a cambios de feature toggles
    this.featureFlagService.features$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  get currentLanguage() {
    return this.languages.find(l => l.code === this.currentLang) ?? this.languages[0];
  }

  get navItems() {
    return this.allNavItems.filter(item => {
      const featureEnabled = !item.feature || this.featureFlagService.isFeatureEnabled(item.feature as keyof FeatureFlags);
      const roleMatch = !(item as any).role || this.authService.normalizeRole(this.user?.role) === (item as any).role;
      return featureEnabled && roleMatch;
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get user(): any {
    return this.authService.getUser();
  }

  get isAdmin(): boolean {
    const u = this.user;
    return u && this.authService.normalizeRole(u.role) === 'admin';
  }

  get isLeader(): boolean {
    const u = this.user;
    return u && this.authService.normalizeRole(u.role) === 'lider';
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
    if (!this.languages.some(language => language.code === lang)) {
      return;
    }

    this.currentLang = lang;
    document.documentElement.lang = lang;
    this.translate.use(lang);
    localStorage.setItem('ecoland_lang', lang);
    this.langOpen = false;
  }
}
