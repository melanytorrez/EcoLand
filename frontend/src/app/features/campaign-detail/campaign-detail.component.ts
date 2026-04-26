import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../../core/services/campaign.service';
import { Campaign } from '../../core/models/campaign.model';
import { AuthService } from '../../core/services/auth.service';
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
  isLoading: boolean = false;
  errorMessage: string | null = null;
  participationLoading: boolean = false;
  participationMessage: string | null = null;
  participationError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.errorMessage = this.translate.instant('campaign_detail.messages.invalid_campaign');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.campaignService.getCampaignById(id).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        if (this.campaign) {
          this.percentage = Math.round((this.campaign.participants / this.campaign.spots) * 100);
          this.availableSpots = this.campaign.spots - this.campaign.participants;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = this.translate.instant('campaign_detail.messages.load_error');
        this.isLoading = false;
      }
    });
  }

  participate(): void {
    if (!this.authService.isAuthenticated()) {
      const currentUrl = this.router.url;
      this.router.navigate(['/login'], {
        queryParams: {
          redirectTo: currentUrl,
          message: this.translate.instant('campaign_detail.messages.login_required')
        }
      });
      return;
    }

    if (!this.campaign) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      this.participationError = this.translate.instant('campaign_detail.messages.no_session');
      return;
    }

    this.participationLoading = true;
    this.participationError = null;
    this.participationMessage = null;

    this.campaignService.participateInCampaign(this.campaign.id, token).subscribe({
      next: (updatedCampaign: Campaign) => {
        this.campaign = updatedCampaign;
        this.percentage = Math.round((updatedCampaign.participants / updatedCampaign.spots) * 100);
        this.availableSpots = updatedCampaign.spots - updatedCampaign.participants;
        this.participationMessage = this.translate.instant('campaign_detail.messages.participation_success');
        this.participationLoading = false;
      },
      error: (error: any) => {
        const backendMessage = error?.error;
        this.participationError = typeof backendMessage === 'string' && backendMessage
          ? backendMessage
          : this.translate.instant('campaign_detail.messages.participation_error');
        this.participationLoading = false;
      }
    });
  }
}