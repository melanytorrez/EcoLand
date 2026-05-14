import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const apiUrl = `${environment.apiUrl}/api/v1/admin`;
  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(mockToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPendingLeaderRequests', () => {
    it('should GET pending leader requests with auth header', () => {
      const mockUsers = [{ id: 1, nombre: 'Juan', email: 'juan@eco.com', role: 'Lider' }];

      service.getPendingLeaderRequests().subscribe(users => {
        expect(users).toEqual(mockUsers as any);
      });

      const req = httpMock.expectOne(`${apiUrl}/leader-requests`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockUsers);
    });

    it('should return empty array when no pending requests', () => {
      service.getPendingLeaderRequests().subscribe(users => {
        expect(users.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/leader-requests`);
      req.flush([]);
    });
  });

  describe('approveLeaderRequest', () => {
    it('should POST to approve endpoint with auth header', () => {
      service.approveLeaderRequest(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/leader-requests/1/approve`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });
  });

  describe('rejectLeaderRequest', () => {
    it('should POST to reject endpoint with auth header', () => {
      service.rejectLeaderRequest(2).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/leader-requests/2/reject`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });
  });

  describe('getAllUsers', () => {
    it('should GET all users with auth header', () => {
      const mockUsers = [
        { id: 1, nombre: 'Ana', email: 'ana@eco.com', role: 'Admin' },
        { id: 2, nombre: 'Luis', email: 'luis@eco.com', role: 'Usuario' }
      ];

      service.getAllUsers().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users[0].email).toBe('ana@eco.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/users`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockUsers);
    });
  });
});
