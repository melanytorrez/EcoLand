import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  standalone: false
})
export class AdminSidebarComponent {
  navItems = [
    { path: '/admin/campanas', label: 'admin_sidebar.nav.reforestation', icon: 'tree-deciduous' },
    { path: '/admin/usuarios', label: 'admin_sidebar.nav.users', icon: 'users' },
    { path: '/admin/feature-toggles', label: 'Feature Toggles', icon: 'toggle-right' },
  ];

  constructor(public router: Router) { }
}
