import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

/**
 * Guard que asegura que las traducciones estén cargadas
 * cuando se navega entre rutas principales
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationInitGuard {
  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.initializeTranslationListener();
  }

  private initializeTranslationListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // Si navegas a rutas principales (no auth), re-inicializa traducción
      if (url === '/' || url.startsWith('/reforestacion') || 
          url.startsWith('/reciclaje') || url.startsWith('/estadisticas') ||
          url.startsWith('/campanas-reciclaje') || url.startsWith('/admin')) {
        this.ensureTranslationLoaded();
      }
    });
  }

  private ensureTranslationLoaded(): void {
    const savedLang = localStorage.getItem('ecoland_lang') || 'es';
    const currentLang = this.translate.currentLanguage || 'es';
    
    // Solo recarga si el idioma cambió o la traducción no está lista
    if (currentLang !== savedLang) {
      this.translate.use(savedLang).subscribe();
    }
  }
}
