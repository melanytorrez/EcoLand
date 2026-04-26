import { Component, ApplicationRef } from '@angular/core';
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

  constructor(
    public router: Router, 
    private translate: TranslateService,
    private appRef: ApplicationRef
  ) {
    const savedLang = localStorage.getItem('ecoland_lang') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(savedLang).subscribe(() => {
      // Forzar una actualización global de Angular una vez que el archivo JSON
      // de traducciones se haya descargado. Esto soluciona el bug de la "pantalla vacía".
      this.appRef.tick();
    });
  }

  hideLayout(): boolean {
    return this.router.url === '/login' || this.router.url === '/register' || this.router.url.startsWith('/admin');
  }
}
