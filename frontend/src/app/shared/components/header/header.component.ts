import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { FeatureFlags } from '../../../core/config/feature-flags.config';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SUPPORTED_LANGUAGES } from '../../../core/config/languages.config';
import { Notificacion } from '../../../core/models/notificacion.model';
import { NotificationService } from '../../../core/services/notification.service';

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
  showNotificationsDropdown = false;
  notifications: Notificacion[] = [];

  languages = SUPPORTED_LANGUAGES;

  allNavItems = [
    { path: '/',              label: 'header.nav.home',          feature: 'inicio' },
    { path: '/reforestacion', label: 'header.nav.reforestation', feature: 'reforestacion' },
    { path: '/reciclaje',     label: 'header.nav.recycling',     feature: 'reciclaje' },
    { path: '/estadisticas',  label: 'header.nav.stats',         feature: 'estadisticas' },
    { path: '/lider/campanas', label: 'header.nav.my_publications', feature: 'reforestacion', role: 'lider' },
  ];

  constructor(
    private router: Router,
    private featureFlagService: FeatureFlagService,
    private authService: AuthService,
    private translate: TranslateService,
    private notificationService: NotificationService,
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

    // Cargar notificaciones iniciales si el usuario está logueado
    if (this.isAuthenticated) {
      this.loadNotifications();
    }
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

  // Lógica de Notificaciones
  toggleNotifications() {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    if (this.showNotificationsDropdown) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (notifs) => {
        this.notifications = notifs;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading notifications', err);
      }
    });
  }

  markNotificationAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
          notif.leido = true;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error marking notification as read', err)
    });
  }

  deleteNotification(id: number) {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error deleting notification', err)
    });
  }

  markAllAsRead() {
    const unread = this.notifications.filter(n => !n.leido);
    if (unread.length === 0) return;
    
    let completed = 0;
    unread.forEach(n => {
      this.notificationService.markAsRead(n.id).subscribe({
        next: () => {
          n.leido = true;
          completed++;
          if (completed === unread.length) {
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  clearAllNotifications() {
    if (this.notifications.length === 0) return;
    let completed = 0;
    const total = this.notifications.length;
    this.notifications.forEach(n => {
      this.notificationService.deleteNotification(n.id).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.notifications = [];
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.leido).length;
  }

  get todayNotifications(): Notificacion[] {
    const now = new Date();
    return this.notifications.filter(n => {
      const diff = now.getTime() - new Date(n.fechaCreacion).getTime();
      return diff < 86400000;
    });
  }

  get olderNotifications(): Notificacion[] {
    const now = new Date();
    return this.notifications.filter(n => {
      const diff = now.getTime() - new Date(n.fechaCreacion).getTime();
      return diff >= 86400000;
    });
  }

  formatRelative(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
    if (min < 1) return 'Ahora mismo';
    if (min < 60) return `Hace ${min} min`;
    if (hr < 24) return `Hace ${hr} h`;
    if (day === 1) return 'Ayer';
    return date.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' });
  }

  getNotificationConfig(mensaje: string): { icon: string; gradient: string; bg: string; dot: string } {
    const msg = (mensaje || '').toLowerCase();
    if (msg.includes('aprobada') || msg.includes('logro') || msg.includes('felicidades')) {
      return {
        icon: 'trophy',
        gradient: 'from-amber-400 to-orange-500',
        bg: 'bg-amber-50',
        dot: 'bg-amber-400'
      };
    }
    if (msg.includes('rechazada') || msg.includes('alerta') || msg.includes('error')) {
      return {
        icon: 'alert-triangle',
        gradient: 'from-orange-400 to-red-500',
        bg: 'bg-orange-50',
        dot: 'bg-orange-400'
      };
    }
    if (msg.includes('líder') || msg.includes('lider') || msg.includes('usuarios') || msg.includes('miembro')) {
      return {
        icon: 'users',
        gradient: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50',
        dot: 'bg-violet-500'
      };
    }
    if (msg.includes('eco') || msg.includes('árbol') || msg.includes('arbol') || msg.includes('recicl') || msg.includes('campaña') || msg.includes('campana')) {
      return {
        icon: 'leaf',
        gradient: 'from-[#2E7D32] to-[#4CAF50]',
        bg: 'bg-[#E8F5E9]',
        dot: 'bg-[#4CAF50]'
      };
    }
    return {
      icon: 'info',
      gradient: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50',
      dot: 'bg-blue-400'
    };
  }
}
