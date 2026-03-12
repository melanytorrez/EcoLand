import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciclajeComponent } from './reciclaje.component';

describe('ReciclajeComponent', () => {
  let component: ReciclajeComponent;
  let fixture: ComponentFixture<ReciclajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReciclajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReciclajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
