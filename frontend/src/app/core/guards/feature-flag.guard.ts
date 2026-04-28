import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureFlagService } from '../services/feature-flag.service';
import { FeatureFlags } from '../config/feature-flags.config';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagGuard implements CanActivate {
  constructor(private featureFlagService: FeatureFlagService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const featureName = route.data['feature'] as keyof FeatureFlags;
    
    if (this.featureFlagService.isFeatureEnabled(featureName as string)) {
      return true;
    }

    return this.router.parseUrl('/login');
  }
}
