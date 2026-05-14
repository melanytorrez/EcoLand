import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ReciclajeComponent } from './reciclaje.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: string): string { return value; }
}

class TranslateServiceStub {
  currentLang = 'es';
  onLangChange = new Subject<any>();
  use = jasmine.createSpy('use');
  instant = jasmine.createSpy('instant').and.callFake((k: string) => k);
}

describe('ReciclajeComponent', () => {
  let component: ReciclajeComponent;
  let fixture: ComponentFixture<ReciclajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReciclajeComponent, FakeTranslatePipe],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ReciclajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
