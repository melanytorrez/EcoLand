import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const adminUrl = `${environment.apiUrl}/api/v1/admin`;
  const usuariosUrl = `${environment.apiUrl}/api/v1/usuarios`;
  const token = 'admin-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(token);

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

  afterEach(() => httpMock.verify());

  describe('getPendingLeaderRequests', () => {
    it('should GET /api/v1/admin/leader-requests with Bearer header', () => {
      service.getPendingLeaderRequests().subscribe();
      const req = httpMock.expectOne(`${adminUrl}/leader-requests`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush([]);
    });
  });

  describe('approveLeaderRequest', () => {
    it('should POST to /leader-requests/:userId/approve', () => {
      service.approveLeaderRequest(10).subscribe();
      const req = httpMock.expectOne(`${adminUrl}/leader-requests/10/approve`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('rejectLeaderRequest', () => {
    it('should POST to /leader-requests/:userId/reject', () => {
      service.rejectLeaderRequest(10).subscribe();
      const req = httpMock.expectOne(`${adminUrl}/leader-requests/10/reject`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('getAllUsers', () => {
    it('should GET /api/v1/admin/users with Bearer header', () => {
      service.getAllUsers().subscribe();
      const req = httpMock.expectOne(`${adminUrl}/users`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush([]);
    });
  });

  describe('updateUser', () => {
    it('should POST /api/v1/usuarios with user data', () => {
      const user = { id: 1, nombre: 'Updated' };
      service.updateUser(1, user).subscribe();
      const req = httpMock.expectOne(usuariosUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.body).toEqual(user);
      req.flush({});
    });
  });

  describe('deleteUser', () => {
    it('should DELETE /api/v1/usuarios/:id', () => {
      service.deleteUser(5).subscribe();
      const req = httpMock.expectOne(`${usuariosUrl}/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('getVolunteerApplicationsByStatus', () => {
    it('should GET /admin/volunteer-applications with default status PENDING', () => {
      service.getVolunteerApplicationsByStatus().subscribe();
      const req = httpMock.expectOne(r =>
        r.url === `${adminUrl}/volunteer-applications` && r.params.get('status') === 'PENDING'
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should GET with custom status ACCEPTED', () => {
      service.getVolunteerApplicationsByStatus('ACCEPTED').subscribe();
      const req = httpMock.expectOne(r =>
        r.url === `${adminUrl}/volunteer-applications` && r.params.get('status') === 'ACCEPTED'
      );
      req.flush([]);
    });
  });

  describe('approveVolunteerApplication', () => {
    it('should POST /volunteer-applications/:id/approve', () => {
      service.approveVolunteerApplication(5).subscribe();
      const req = httpMock.expectOne(`${adminUrl}/volunteer-applications/5/approve`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('rejectVolunteerApplication', () => {
    it('should POST /volunteer-applications/:id/reject with adminNotes param', () => {
      service.rejectVolunteerApplication(5, 'incomplete data').subscribe();
      const req = httpMock.expectOne(r =>
        r.url === `${adminUrl}/volunteer-applications/5/reject` && r.params.get('adminNotes') === 'incomplete data'
      );
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('getRecyclingActivitiesByStatus', () => {
    it('should GET /admin/recycling-activities with default status PENDING', () => {
      service.getRecyclingActivitiesByStatus().subscribe();
      const req = httpMock.expectOne(r =>
        r.url === `${adminUrl}/recycling-activities` && r.params.get('status') === 'PENDING'
      );
      req.flush([]);
    });

    it('should GET with status APPROVED', () => {
      service.getRecyclingActivitiesByStatus('APPROVED').subscribe();
      const req = httpMock.expectOne(r =>
        r.url === `${adminUrl}/recycling-activities` && r.params.get('status') === 'APPROVED'
      );
      req.flush([]);
    });
  });

  describe('approveRecyclingActivity', () => {
    it('should POST /recycling-activities/:id/approve', () => {
      service.approveRecyclingActivity(3).subscribe();
      const req = httpMock.expectOne(`${adminUrl}/recycling-activities/3/approve`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('rejectRecyclingActivity', () => {
    it('should POST /recycling-activities/:id/reject with adminNotes param', () => {
      service.rejectRecyclingActivity(3, 'fraud').subscribe();
      const req = httpMock.expectOne(r =>
        r.url === `${adminUrl}/recycling-activities/3/reject` && r.params.get('adminNotes') === 'fraud'
      );
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });
});
