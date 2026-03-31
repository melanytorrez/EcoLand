import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  standalone: false
})
export class AdminSidebarComponent {
  navItems = [
    { path: '/admin/campanas', label: 'Campañas', icon: 'tree-deciduous' },
  ];

  constructor(public router: Router) { }
}
