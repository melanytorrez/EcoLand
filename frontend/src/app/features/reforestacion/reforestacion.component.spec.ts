import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReforestacionComponent } from './reforestacion.component';

describe('ReforestacionComponent', () => {
  let component: ReforestacionComponent;
  let fixture: ComponentFixture<ReforestacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReforestacionComponent]
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
