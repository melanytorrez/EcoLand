import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appIfFeature]',
  standalone: false
})
export class IfFeatureDirective implements OnInit, OnDestroy {
  private featureName!: string;
  private hasView = false;
  private subscription!: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  @Input() set appIfFeature(featureName: string) {
    this.featureName = featureName;
    this.updateView();
  }

  ngOnInit() {
    this.subscription = this.featureFlagService.features$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateView() {
    if (!this.featureName) return;
    
    const isEnabled = this.featureFlagService.isFeatureEnabled(this.featureName);

    if (isEnabled && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isEnabled && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
