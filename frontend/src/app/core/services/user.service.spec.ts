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
  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(mockToken);

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

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMyParticipations', () => {
    it('should GET user participations with auth header', () => {
      const mockCampaigns = [{ id: 1, title: 'Reforestación Tunari', participants: 50 }];

      service.getMyParticipations().subscribe(campaigns => {
        expect(campaigns.length).toBe(1);
        expect(campaigns[0].title).toBe('Reforestación Tunari');
      });

      const req = httpMock.expectOne(`${apiUrl}/me/participations`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockCampaigns);
    });

    it('should return empty array when user has no participations', () => {
      service.getMyParticipations().subscribe(campaigns => {
        expect(campaigns.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/me/participations`);
      req.flush([]);
    });
  });

  describe('getProfile', () => {
    it('should GET user profile with auth header', () => {
      const mockUser = { id: 1, nombre: 'Ana Verde', email: 'ana@eco.com', role: 'Usuario' };

      service.getProfile().subscribe(user => {
        expect(user.nombre).toBe('Ana Verde');
        expect(user.email).toBe('ana@eco.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockUser);
    });
  });

  describe('requestLeaderStatus', () => {
    it('should POST to leader request endpoint with auth header', () => {
      service.requestLeaderStatus().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/me/request-leader`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({ success: true });
    });

    it('should POST with provided data payload', () => {
      const payload = { motivo: 'Quiero liderar campañas' };
      service.requestLeaderStatus(payload).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/me/request-leader`);
      expect(req.request.body).toEqual(payload);
      req.flush({ success: true });
    });
  });
});
