import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureToggleService } from '../../core/services/feature-toggle.service';

@Directive({
  selector: '[appIfFeature]'
})
export class IfFeatureDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureToggleService: FeatureToggleService
  ) {}

  @Input() set appIfFeature(featureName: string) {
    const isEnabled = this.featureToggleService.isEnabled(featureName);

    if (isEnabled && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isEnabled && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
