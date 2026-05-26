import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReforestacionComponent } from './reforestacion.component';

describe('ReforestacionComponent', () => {
  let component: ReforestacionComponent;
  let fixture: ComponentFixture<ReforestacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReforestacionComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReforestacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
