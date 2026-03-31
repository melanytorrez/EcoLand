import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../core/services/campaign.service';
import { Campaign } from '../../core/models/campaign.model';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.errorMessage = 'Campana no valida.';
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
        this.errorMessage = 'No se pudo cargar el detalle de la campana.';
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
          message: 'Debes iniciar sesion para participar en una campana de reforestacion.'
        }
      });
      return;
    }

    if (!this.campaign) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      this.participationError = 'No se encontro sesion activa.';
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
        this.participationMessage = 'Participacion registrada con exito.';
        this.participationLoading = false;
      },
      error: (error: any) => {
        const backendMessage = error?.error;
        this.participationError = typeof backendMessage === 'string' && backendMessage
          ? backendMessage
          : 'No se pudo completar la participacion. Intenta nuevamente.';
        this.participationLoading = false;
      }
    });
  }
}
