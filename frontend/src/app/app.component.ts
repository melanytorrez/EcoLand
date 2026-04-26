import { Component, OnInit, ApplicationRef, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ecoland-angular';

  constructor(
    public router: Router,
    private translate: TranslateService,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Forzar una revisión total cuando cambie el idioma
    this.translate.onLangChange.subscribe(() => {
      this.ngZone.run(() => {
        this.appRef.tick();
      });
    });

    // Forzar una revisión total al terminar cualquier navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.appRef.tick();
        });
      }, 0);
    });
  }

  hideLayout(): boolean {
    return this.router.url === '/login' || this.router.url === '/register' || this.router.url.startsWith('/admin');
  }
}
