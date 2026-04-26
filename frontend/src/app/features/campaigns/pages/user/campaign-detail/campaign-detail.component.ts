import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../core/services/campaign.service';
import { Campaign } from '../../../../../core/models/campaign.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.css',
  standalone: false
})
export class CampaignDetailComponent implements OnInit {
  campaign: Campaign | undefined;
  percentage: number = 0;
  availableSpots: number = 0;

  participationMessage: string | null = null;
  participationError: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : null;

      if (id) {
        this.campaignService.getCampaignById(id).subscribe(campaign => {
          this.campaign = campaign;

          if (this.campaign) {
            this.percentage = Math.round(
              (this.campaign.participants / this.campaign.spots) * 100
            );
            this.availableSpots =
              this.campaign.spots - this.campaign.participants;
          }

          this.cdr.detectChanges();
        });
      }
    });
  }

  participate(): void {
    if (!this.campaign || this.campaign.id === undefined) return;

    if (!this.authService.isAuthenticated()) {
      this.participationError = this.translate.instant('campaign_detail.messages.login_required');
      return;
    }

    const token = this.authService.getToken()!;
    this.isSubmitting = true;
    this.participationMessage = null;
    this.participationError = null;

    this.campaignService.participateInCampaign(this.campaign.id, token).subscribe({
      next: (updatedCampaign) => {
        this.campaign = updatedCampaign;
        this.percentage = Math.round(
          (updatedCampaign.participants / updatedCampaign.spots) * 100
        );
        this.availableSpots =
          updatedCampaign.spots - updatedCampaign.participants;

        this.participationMessage = this.translate.instant(
          'campaign_detail.messages.participation_success'
        );

        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let msg = '';

        if (typeof err?.error === 'string') {
          msg = err.error;
        } else if (typeof err?.error?.message === 'string') {
          msg = err.error.message;
        } else if (typeof err?.message === 'string') {
          msg = err.message;
        }

        if (err.status === 409 || msg.includes('Ya estás inscrito')) {
          this.participationError = this.translate.instant(
            'campaign_detail.messages.already_registered_info'
          );
        } else {
          this.participationError = this.translate.instant(
            'campaign_detail.messages.participation_error_late'
          );
        }

        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}