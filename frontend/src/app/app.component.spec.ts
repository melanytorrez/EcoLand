import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: string): string { return value; }
}

class TranslateServiceStub {
  currentLang = 'es';
  onLangChange = new Subject<any>();
  use = jasmine.createSpy('use');
  instant = jasmine.createSpy('instant').and.callFake((k: string) => k);
  get = jasmine.createSpy('get').and.returnValue(new Subject());
  setDefaultLang = jasmine.createSpy('setDefaultLang');
  addLangs = jasmine.createSpy('addLangs');
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), HttpClientTestingModule],
      declarations: [AppComponent, FakeTranslatePipe],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title ecoland-angular', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ecoland-angular');
  });
});
