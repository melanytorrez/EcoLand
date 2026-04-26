import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<any> {
    // Usamos ruta absoluta para que funcione en cualquier sub-ruta
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

import { APP_INITIALIZER, NgZone } from '@angular/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export function appInitializerFactory(translate: TranslateService, ngZone: NgZone) {
  return () => {
    return new Promise((resolve) => {
      ngZone.run(() => {
        const savedLang = localStorage.getItem('ecoland_lang') || 'es';
        translate.setDefaultLang('es');
        translate.use(savedLang).subscribe({
          next: () => resolve(true),
          error: () => resolve(true) // Resolvemos igual para no bloquear la app si falla el JSON
        });
      });
    });
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, NgZone],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
