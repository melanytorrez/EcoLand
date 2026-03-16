import { Injectable } from '@angular/core';
import { FEATURE_FLAGS, FeatureFlags } from '../config/feature-flags.config';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private flags: FeatureFlags = FEATURE_FLAGS;

  isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
    return this.flags[featureName] || false;
  }

  getFlags(): FeatureFlags {
    return { ...this.flags };
  }
}
