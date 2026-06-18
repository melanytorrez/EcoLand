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
    { path: '/admin/volunteer-applications', label: 'admin_sidebar.nav.volunteer_applications', icon: 'leaf' },
    { path: '/admin/solicitudes', label: 'admin_sidebar.nav.campaign_requests', icon: 'clipboard-list' },
    { path: '/admin/puntos-verdes', label: 'admin_sidebar.nav.green_points', icon: 'map-pin' },
    { path: '/admin/recycling-activities', label: 'admin_sidebar.nav.recycling_activities', icon: 'recycle' },
    { path: '/admin/usuarios', label: 'admin_sidebar.nav.users', icon: 'users' },
  ];

  constructor(public router: Router) { }
}
