import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FeatureToggleService } from '../services/feature-toggle.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanActivate {

  constructor(
    private featureToggleService: FeatureToggleService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredFeature = route.data['feature'] as string;
    
    if (requiredFeature && !this.featureToggleService.isEnabled(requiredFeature)) {
      console.warn(`Access denied to route: feature '${requiredFeature}' is disabled.`);
      this.router.navigate(['/']); // Redirigir al Home
      return false;
    }
    
    return true;
  }
}
