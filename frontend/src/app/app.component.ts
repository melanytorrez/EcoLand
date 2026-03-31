import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecoland-angular';
  constructor(public router: Router) {}

  hideLayout(): boolean {
    return this.router.url === '/login' || this.router.url === '/register' || this.router.url.startsWith('/admin');
  }
}
