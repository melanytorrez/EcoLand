import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRoles = route.data['expectedRoles'] as Array<string>;
    const user = this.authService.getUser();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const userRole = this.authService.normalizeRole(user.role);

    if (expectedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to home or error page if role not authorized
    this.router.navigate(['/']);
    return false;
  }
}
