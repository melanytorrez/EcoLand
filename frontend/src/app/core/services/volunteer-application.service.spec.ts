import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VolunteerApplicationService } from './volunteer-application.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('VolunteerApplicationService', () => {
  let service: VolunteerApplicationService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrl = `${environment.apiUrl}/api/v1/volunteer-applications`;
  const token = 'vol-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(token);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VolunteerApplicationService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(VolunteerApplicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('apply', () => {
    const application: any = {
      campaignId: 1,
      fullName: 'John Doe',
      age: 25,
      phone: '12345678',
      motivation: 'I want to help',
      availabilityHours: 'Weekends'
    };

    it('should POST to /api/v1/volunteer-applications with Authorization header when token exists', () => {
      service.apply(application).subscribe();
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });

    it('should POST without Authorization header when no token', () => {
      authServiceSpy.getToken.and.returnValue(null);
      service.apply(application).subscribe();
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });
  });

  describe('getByCampaign', () => {
    it('should GET /campaign/:campaignId with Authorization header', () => {
      service.getByCampaign(7).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/campaign/7`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush([]);
    });
  });

  describe('getMyApplication', () => {
    it('should GET /campaign/:campaignId/me with Authorization header', () => {
      service.getMyApplication(7).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/campaign/7/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });
  });
});
