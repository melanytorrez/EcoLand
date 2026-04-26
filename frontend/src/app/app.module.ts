import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

import { NgZone } from '@angular/core';

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
          error: () => resolve(true)
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
    SharedModule,
    SocialLoginModule
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('453422657382-mpgsm4p398f0s54848p4uhmrop3uueu6.apps.googleusercontent.com')
          }
        ],
        onError: (err: any) => {
          console.error('Google Auth Error:', err);
        }
      } as SocialAuthServiceConfig,
    },
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
