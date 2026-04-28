import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagService } from '../../core/services/feature-flag.service';

@Directive({
  selector: '[appIfFeature]',
  standalone: false
})
export class IfFeatureDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  @Input() set appIfFeature(featureName: string) {
    const isEnabled = this.featureFlagService.isFeatureEnabled(featureName);

    if (isEnabled && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isEnabled && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
