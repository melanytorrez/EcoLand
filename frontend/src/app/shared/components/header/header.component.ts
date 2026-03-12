import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent {
  currentPath = '';
  isAuthenticated = false; // Mock for now
  isAdmin = false; // Mock for now
  user = { name: 'Usuario' };

  navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/reforestacion', label: 'Reforestación' },
    { path: '/campanas-reciclaje', label: 'Campañas de Reciclaje' },
    { path: '/reciclaje', label: 'Reciclaje' },
    { path: '/estadisticas', label: 'Estadísticas' },
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects;
    });
  }

  logout() {
    this.isAuthenticated = false;
  }
}
