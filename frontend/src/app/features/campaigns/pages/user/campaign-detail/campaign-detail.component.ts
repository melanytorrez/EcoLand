import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../core/services/campaign.service';
import { Campaign } from '../../../../../core/models/campaign.model';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';

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
    private cdr: ChangeDetectorRef
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
      this.participationError = 'Debes iniciar sesión para participar en una campaña';
      return;
    }

    const token = this.authService.getToken()!;
    this.isSubmitting = true;
    this.participationMessage = null;
    this.participationError = null;

    this.campaignService.participateInCampaign(this.campaign.id, token).subscribe({
      next: (updatedCampaign) => {
        this.campaign = updatedCampaign;
        this.percentage = Math.round((updatedCampaign.participants / updatedCampaign.spots) * 100);
        this.availableSpots = updatedCampaign.spots - updatedCampaign.participants;
        this.participationMessage = 'Inscripción exitosa.';
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
           this.participationError = 'Ya estás inscrito en esta campaña';
        } else {
           this.participationError = 'Error al intentar inscribirse. Inténtalo más tarde.';
        }
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
