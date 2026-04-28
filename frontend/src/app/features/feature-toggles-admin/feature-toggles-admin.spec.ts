import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureTogglesAdmin } from './feature-toggles-admin';

describe('FeatureTogglesAdmin', () => {
  let component: FeatureTogglesAdmin;
  let fixture: ComponentFixture<FeatureTogglesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureTogglesAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureTogglesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
