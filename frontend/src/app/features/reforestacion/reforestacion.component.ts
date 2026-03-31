import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from '../../core/services/campaign.service';
import { Campaign } from '../../core/models/campaign.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reforestacion',
  templateUrl: './reforestacion.component.html',
  styleUrl: './reforestacion.component.css',
  standalone: false
})
export class ReforestacionComponent implements OnInit {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private campaignService: CampaignService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.isLoading = true;
    this.error = null;
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.filteredCampaigns = campaigns;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las campañas. Por favor, verifica tu conexión.';
        this.isLoading = false;
        console.error('Error loading campaigns:', err);
      }
    });
  }

  filterCampaigns(): void {
    this.filteredCampaigns = this.campaigns.filter(campaign =>
      campaign.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  calculatePercentage(participants: number, total: number): number {
    if (!total) {
      return 0;
    }
    return Math.round((participants / total) * 100);
  }

  retry(): void {
    this.ngOnInit();
  }

  participate(campaignId: number): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/reforestacion', campaignId]);
      return;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        redirectTo: `/reforestacion/${campaignId}`,
        message: 'Debes iniciar sesion para participar en una campana de reforestacion.'
      }
    });
  }
}
