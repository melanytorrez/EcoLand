import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FeatureFlagGuard } from './feature-flag.guard';
import { FeatureFlagService } from '../services/feature-flag.service';

describe('FeatureFlagGuard', () => {
  let guard: FeatureFlagGuard;
  let featureFlagServiceSpy: jasmine.SpyObj<FeatureFlagService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRoute = (feature: string): ActivatedRouteSnapshot => {
    return { data: { feature } } as any;
  };
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    featureFlagServiceSpy = jasmine.createSpyObj('FeatureFlagService', ['isFeatureEnabled']);
    routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);
    routerSpy.parseUrl.and.returnValue({ toString: () => '/login' } as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        FeatureFlagGuard,
        { provide: FeatureFlagService, useValue: featureFlagServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(FeatureFlagGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when the feature is enabled', () => {
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(true);

    const result = guard.canActivate(mockRoute('reforestacion'), mockState);

    expect(result).toBeTrue();
    expect(routerSpy.parseUrl).not.toHaveBeenCalled();
  });

  it('should redirect to /login when the feature is disabled', () => {
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(false);

    const result = guard.canActivate(mockRoute('reciclaje'), mockState);

    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).not.toBeTrue();
  });

  it('should call isFeatureEnabled with the feature name from route data', () => {
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(true);

    guard.canActivate(mockRoute('estadisticas'), mockState);

    expect(featureFlagServiceSpy.isFeatureEnabled).toHaveBeenCalledWith('estadisticas');
  });

  it('should redirect when feature name is unknown (not in DB defaults to disabled)', () => {
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(false);

    const result = guard.canActivate(mockRoute('feature-inexistente'), mockState);

    expect(result).not.toBeTrue();
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/login');
  });
});
