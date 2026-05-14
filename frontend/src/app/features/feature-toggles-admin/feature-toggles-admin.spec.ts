import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeatureTogglesAdmin } from './feature-toggles-admin';
import { FeatureFlagService } from '../../core/services/feature-flag.service';

class FeatureFlagServiceStub {
  loadFeatures = jasmine.createSpy('loadFeatures').and.returnValue({ subscribe: () => {} });
  getAllToggles = jasmine.createSpy('getAllToggles').and.returnValue({});
  updateFeature = jasmine.createSpy('updateFeature').and.returnValue({ subscribe: () => {} });
  getFlags = jasmine.createSpy('getFlags').and.returnValue({});
}

describe('FeatureTogglesAdmin', () => {
  let component: FeatureTogglesAdmin;
  let fixture: ComponentFixture<FeatureTogglesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureTogglesAdmin],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: FeatureFlagService, useClass: FeatureFlagServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureTogglesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
