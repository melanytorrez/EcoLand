import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrl = `${environment.apiUrl}/api/v1/usuarios`;
  const token = 'user-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(token);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getMyParticipations', () => {
    it('should GET /me/participations with Bearer header', () => {
      service.getMyParticipations().subscribe();
      const req = httpMock.expectOne(`${apiUrl}/me/participations`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush([]);
    });
  });

  describe('getProfile', () => {
    it('should GET /me with Bearer header', () => {
      service.getProfile().subscribe();
      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({ id: 1 });
    });
  });

  describe('getMyBadges', () => {
    it('should GET /me/badges with Bearer header', () => {
      service.getMyBadges().subscribe();
      const req = httpMock.expectOne(`${apiUrl}/me/badges`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({ earnedBadges: [], progress: [] });
    });
  });

  describe('requestLeaderStatus', () => {
    it('should POST /me/request-leader with Bearer header and data', () => {
      const data = { motivation: 'I want to lead', zone: 'Norte' };
      service.requestLeaderStatus(data).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/me/request-leader`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.body).toEqual(data);
      req.flush({});
    });

    it('should POST /me/request-leader with empty object when no data', () => {
      service.requestLeaderStatus().subscribe();
      const req = httpMock.expectOne(`${apiUrl}/me/request-leader`);
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });
});
