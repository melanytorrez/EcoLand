import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FooterComponent } from './footer.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { AuthService } from '../../../core/services/auth.service';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let featureFlagServiceSpy: jasmine.SpyObj<FeatureFlagService>;
  const featuresSubject = new BehaviorSubject<any>({});

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser', 'normalizeRole']);
    featureFlagServiceSpy = jasmine.createSpyObj('FeatureFlagService', ['isFeatureEnabled']);
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(true);
    (featureFlagServiceSpy as any).features$ = featuresSubject.asObservable();

    authServiceSpy.getUser.and.returnValue(null);
    authServiceSpy.normalizeRole.and.returnValue('usuario');

    await TestBed.configureTestingModule({
      declarations: [FooterComponent, FakeTranslatePipe],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: FeatureFlagService, useValue: featureFlagServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from features$ subscription', () => {
      const sub = (component as any).subscription;
      spyOn(sub, 'unsubscribe');
      component.ngOnDestroy();
      expect(sub.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('isAdmin getter', () => {
    it('should return false when no user', () => {
      authServiceSpy.getUser.and.returnValue(null);
      expect(component.isAdmin).toBeFalsy();
    });

    it('should return true for admin user', () => {
      authServiceSpy.getUser.and.returnValue({ role: 'ADMINISTRADOR' });
      authServiceSpy.normalizeRole.and.returnValue('admin');
      expect(component.isAdmin).toBeTrue();
    });

    it('should return false for non-admin user', () => {
      authServiceSpy.getUser.and.returnValue({ role: 'USUARIO' });
      authServiceSpy.normalizeRole.and.returnValue('usuario');
      expect(component.isAdmin).toBeFalse();
    });
  });

  describe('isFeatureEnabled', () => {
    it('should delegate to featureFlagService.isFeatureEnabled', () => {
      featureFlagServiceSpy.isFeatureEnabled.and.returnValue(false);
      expect(component.isFeatureEnabled('reciclaje')).toBeFalse();
      expect(featureFlagServiceSpy.isFeatureEnabled).toHaveBeenCalledWith('reciclaje');
    });

    it('should return true when feature is enabled', () => {
      featureFlagServiceSpy.isFeatureEnabled.and.returnValue(true);
      expect(component.isFeatureEnabled('estadisticas')).toBeTrue();
    });
  });
});
