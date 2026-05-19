import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FeatureFlagService } from './feature-flag.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const apiUrl = `${environment.apiUrl}/api/features`;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FeatureFlagService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(FeatureFlagService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadFeatures', () => {
    it('should GET features from API and store them', () => {
      const mockFeatures = { reforestacion: true, reciclaje: false, estadisticas: true };

      service.loadFeatures().subscribe(() => {
        expect(service.isFeatureEnabled('reforestacion')).toBeTrue();
        expect(service.isFeatureEnabled('reciclaje')).toBeFalse();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockFeatures);
    });

    it('should emit updated features through features$ observable', (done) => {
      const mockFeatures = { reforestacion: true, reciclaje: true };

      service.features$.subscribe(features => {
        if (Object.keys(features).length > 0) {
          expect(features['reforestacion']).toBeTrue();
          done();
        }
      });

      service.loadFeatures().subscribe();
      httpMock.expectOne(apiUrl).flush(mockFeatures);
    });

    it('should use safe defaults when API call fails', () => {
      service.loadFeatures().subscribe(() => {
        expect(service.isFeatureEnabled('inicio')).toBeTrue();
        expect(service.isFeatureEnabled('reforestacion')).toBeTrue();
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true when feature is enabled', () => {
      service.loadFeatures().subscribe();
      httpMock.expectOne(apiUrl).flush({ reforestacion: true });

      expect(service.isFeatureEnabled('reforestacion')).toBeTrue();
    });

    it('should return false when feature is explicitly disabled', () => {
      service.loadFeatures().subscribe();
      httpMock.expectOne(apiUrl).flush({ reciclaje: false });

      expect(service.isFeatureEnabled('reciclaje')).toBeFalse();
    });
  });

  describe('getFlags', () => {
    it('should return a copy of the current feature flags', () => {
      service.loadFeatures().subscribe();
      httpMock.expectOne(apiUrl).flush({ reforestacion: true, estadisticas: false });

      const flags = service.getFlags();
      expect(flags['reforestacion']).toBeTrue();
      expect(flags['estadisticas']).toBeFalse();
    });
  });

  describe('updateFeature', () => {
    it('should PUT to update a feature toggle', () => {
      service.loadFeatures().subscribe();
      httpMock.expectOne(apiUrl).flush({ reforestacion: true });

      service.updateFeature('reforestacion', false).subscribe(() => {
        expect(service.isFeatureEnabled('reforestacion')).toBeFalse();
      });

      const req = httpMock.expectOne(`${apiUrl}/reforestacion?enabled=false`);
      expect(req.request.method).toBe('PUT');
      req.flush(null);
    });
  });
});
