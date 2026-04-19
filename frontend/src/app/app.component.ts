import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecoland-angular';

  constructor(public router: Router, private translate: TranslateService) {
    // Inicializar el idioma en el componente raíz para que esté listo
    // antes de que cualquier componente hijo renderice sus traducciones.
    const savedLang = localStorage.getItem('ecoland_lang') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(savedLang);
  }

  hideLayout(): boolean {
    return this.router.url === '/login' || this.router.url === '/register' || this.router.url.startsWith('/admin');
  }
}
