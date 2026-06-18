import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      service.setToken('my-token');
      expect(localStorage.getItem('auth_token')).toBe('my-token');
    });
  });

  describe('setSession', () => {
    it('should store token when response contains token', () => {
      service.setSession({ token: 'abc123', nombre: 'Juan', email: 'juan@test.com', role: 'USUARIO' });
      expect(localStorage.getItem('auth_token')).toBe('abc123');
    });

    it('should store user object in localStorage', () => {
      service.setSession({ token: 'abc', id: 1, nombre: 'Juan', email: 'juan@test.com', role: 'USUARIO', promotionStatus: 'NONE' });
      const stored = JSON.parse(localStorage.getItem('auth_user')!);
      expect(stored.nombre).toBe('Juan');
      expect(stored.email).toBe('juan@test.com');
      expect(stored.role).toBe('USUARIO');
    });

    it('should use estadoSolicitud as promotionStatus fallback', () => {
      service.setSession({ token: 'abc', nombre: 'Ana', email: 'ana@test.com', role: 'USUARIO', estadoSolicitud: 'PENDING' });
      const stored = JSON.parse(localStorage.getItem('auth_user')!);
      expect(stored.promotionStatus).toBe('PENDING');
    });

    it('should not store user when nombre and email are absent', () => {
      service.setSession({ token: 'only-token' });
      expect(localStorage.getItem('auth_token')).toBe('only-token');
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should merge new fields into existing stored user', () => {
      localStorage.setItem('auth_user', JSON.stringify({ id: 1, nombre: 'Old', role: 'USUARIO' }));
      service.updateUser({ nombre: 'New', promotionStatus: 'PENDING' });
      const updated = JSON.parse(localStorage.getItem('auth_user')!);
      expect(updated.nombre).toBe('New');
      expect(updated.id).toBe(1);
      expect(updated.promotionStatus).toBe('PENDING');
    });

    it('should create user entry when none exists', () => {
      service.updateUser({ nombre: 'Fresh' });
      const stored = JSON.parse(localStorage.getItem('auth_user')!);
      expect(stored.nombre).toBe('Fresh');
    });
  });

  describe('normalizeRole', () => {
    it('should return admin for ADMIN', () => {
      expect(service.normalizeRole('ADMIN')).toBe('admin');
    });

    it('should return admin for ADMINISTRADOR', () => {
      expect(service.normalizeRole('ADMINISTRADOR')).toBe('admin');
    });

    it('should return lider for LIDER', () => {
      expect(service.normalizeRole('LIDER')).toBe('lider');
    });

    it('should return usuario for USUARIO', () => {
      expect(service.normalizeRole('USUARIO')).toBe('usuario');
    });

    it('should return usuario for null', () => {
      expect(service.normalizeRole(null)).toBe('usuario');
    });

    it('should return usuario for undefined', () => {
      expect(service.normalizeRole(undefined)).toBe('usuario');
    });

    it('should return usuario for empty string', () => {
      expect(service.normalizeRole('')).toBe('usuario');
    });
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return stored token', () => {
      localStorage.setItem('auth_token', 'tok123');
      expect(service.getToken()).toBe('tok123');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'tok');
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('logout', () => {
    it('should remove auth_token and auth_user from localStorage', () => {
      localStorage.setItem('auth_token', 'tok');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));
      service.logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return parsed user from localStorage', () => {
      const user = { id: 1, nombre: 'Maria', role: 'LIDER' };
      localStorage.setItem('auth_user', JSON.stringify(user));
      const result = service.getUser();
      expect(result.nombre).toBe('Maria');
    });

    it('should remove invalid JSON and fall back to token', () => {
      localStorage.setItem('auth_user', 'not-json{{{');
      expect(localStorage.getItem('auth_user')).toBe('not-json{{{');
      const result = service.getUser();
      expect(result).toBeNull(); // no token either
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should return null when no user and no token', () => {
      expect(service.getUser()).toBeNull();
    });

    it('should decode JWT payload when no stored user', () => {
      const payload = btoa(JSON.stringify({ sub: 'user@test.com', role: 'USUARIO' }));
      const fakeToken = `header.${payload}.sig`;
      localStorage.setItem('auth_token', fakeToken);
      const user = service.getUser();
      expect(user.role).toBe('USUARIO');
    });
  });

  describe('login', () => {
    it('should POST to /auth/login with credentials', () => {
      const creds = { email: 'a@b.com', password: '123' };
      service.login(creds).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(creds);
      req.flush({ token: 'tok' });
    });
  });

  describe('register', () => {
    it('should POST to /auth/register with user data', () => {
      const userData = { nombre: 'X', email: 'x@x.com', password: 'pass' };
      service.register(userData).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush({ token: 'tok' });
    });
  });

  describe('loginWithGoogle', () => {
    it('should POST to /auth/google with tokenId', () => {
      service.loginWithGoogle('google-id-token').subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/google`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ tokenId: 'google-id-token' });
      req.flush({ token: 'tok' });
    });
  });
});
