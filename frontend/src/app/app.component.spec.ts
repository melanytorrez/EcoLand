import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  const routerEvents = new BehaviorSubject<any>(null);

  const translateStub = {
    instant: (key: string) => key,
    get: (key: string) => new BehaviorSubject(key).asObservable(),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
    currentLang: 'es',
    use: jasmine.createSpy('use')
  };

  function buildRouter(url: string) {
    return {
      url,
      navigate: jasmine.createSpy('navigate'),
      events: routerEvents.asObservable()
    };
  }

  async function createComponent(url: string) {
    const routerSpy = buildRouter(url);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: TranslateService, useValue: translateStub },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    return { fixture, component: fixture.componentInstance };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('should create the app', async () => {
    const { component } = await createComponent('/');
    expect(component).toBeTruthy();
  });

  it('should have title "ecoland-angular"', async () => {
    const { component } = await createComponent('/');
    expect(component.title).toBe('ecoland-angular');
  });

  describe('hideLayout', () => {
    it('should return true for /login', async () => {
      const { component } = await createComponent('/login');
      expect(component.hideLayout()).toBeTrue();
    });

    it('should return true for /register', async () => {
      const { component } = await createComponent('/register');
      expect(component.hideLayout()).toBeTrue();
    });

    it('should return true for /admin paths', async () => {
      const { component } = await createComponent('/admin/users');
      expect(component.hideLayout()).toBeTrue();
    });

    it('should return false for /reforestacion', async () => {
      const { component } = await createComponent('/reforestacion');
      expect(component.hideLayout()).toBeFalse();
    });

    it('should return false for home path', async () => {
      const { component } = await createComponent('/');
      expect(component.hideLayout()).toBeFalse();
    });
  });
});
