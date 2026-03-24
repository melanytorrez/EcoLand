import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { FeatureFlags } from '../../../core/config/feature-flags.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent implements OnDestroy {
  currentPath = '';
  isAuthenticated = false;
  isAdmin = false;
  user = { name: '' };
  private readonly subscriptions = new Subscription();

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

  constructor(
    private router: Router,
    private featureFlagService: FeatureFlagService,
    private authService: AuthService
  ) {
    this.currentPath = this.router.url;

    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.currentPath = event.urlAfterRedirects;
      })
    );

    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.isAuthenticated = !!user;
        this.user.name = user?.fullName ?? '';
        this.isAdmin = user?.role === 'Administrador';
      })
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
