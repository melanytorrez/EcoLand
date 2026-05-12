import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(
    private featureFlagService: FeatureFlagService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.featureFlagService.features$.subscribe(() => {
      // Reactively update when toggles change
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isFeatureEnabled(featureName: string): boolean {
    return this.featureFlagService.isFeatureEnabled(featureName);
  }

  get isAdmin(): boolean {
    const user = this.authService.getUser();
    return user && this.authService.normalizeRole(user.role) === 'admin';
  }
}
