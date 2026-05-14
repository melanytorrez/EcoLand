import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRoute = (roles: string[]): ActivatedRouteSnapshot => {
    return { data: { expectedRoles: roles } } as any;
  };
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser', 'normalizeRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user has the expected role', () => {
    authServiceSpy.getUser.and.returnValue({ id: 1, email: 'admin@eco.com', role: 'ADMINISTRADOR' });
    authServiceSpy.normalizeRole.and.returnValue('admin');

    const result = guard.canActivate(mockRoute(['admin']), mockState);

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /auth/login when no user is logged in', () => {
    authServiceSpy.getUser.and.returnValue(null);

    const result = guard.canActivate(mockRoute(['admin']), mockState);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should redirect to / when user role is not in expectedRoles', () => {
    authServiceSpy.getUser.and.returnValue({ id: 2, email: 'user@eco.com', role: 'Usuario' });
    authServiceSpy.normalizeRole.and.returnValue('usuario');

    const result = guard.canActivate(mockRoute(['admin', 'lider']), mockState);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow lider access to lider-only routes', () => {
    authServiceSpy.getUser.and.returnValue({ id: 3, email: 'lider@eco.com', role: 'LIDER' });
    authServiceSpy.normalizeRole.and.returnValue('lider');

    const result = guard.canActivate(mockRoute(['admin', 'lider']), mockState);

    expect(result).toBeTrue();
  });

  it('should allow access to routes that accept multiple roles', () => {
    authServiceSpy.getUser.and.returnValue({ id: 4, email: 'user@eco.com', role: 'Usuario' });
    authServiceSpy.normalizeRole.and.returnValue('usuario');

    const result = guard.canActivate(mockRoute(['admin', 'lider', 'usuario']), mockState);

    expect(result).toBeTrue();
  });
});
