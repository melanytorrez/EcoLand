import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Campaign } from '../../core/models/campaign.model';
import { CampaignService } from '../../core/services/campaign.service';
import { StatisticsService } from '../../core/services/statistics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})
export class HomeComponent implements OnInit {
  stats = [
    { icon: 'trending-up', label: 'home.stats.activeCampaigns', value: '...' },
    { icon: 'users', label: 'home.stats.totalParticipants', value: '...' },
    { icon: 'tree-deciduous', label: 'home.stats.totalCampaigns', value: '...' },
  ];
  
  isLoadingStats = true;
  isLoadingCampaigns = true;
  campaigns: Campaign[] = [];

  constructor(
    private campaignService: CampaignService,
    private statisticsService: StatisticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns.slice(0, 3);
        this.isLoadingCampaigns = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.campaigns = [];
        this.isLoadingCampaigns = false;
        this.cdr.detectChanges();
      }
    });

    this.statisticsService.getQuickStats().subscribe({
      next: (data) => {
        this.stats[0].value = data.activeCampaigns.toLocaleString();
        this.stats[1].value = data.totalParticipants.toLocaleString();
        this.stats[2].value = data.totalCampaigns.toLocaleString();
        this.isLoadingStats = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingStats = false;
        this.cdr.detectChanges();
        // En caso de error, dejamos los valores predeterminados '...'
      }
    });
  }

  getSpotCount(spots: number): string {
    return String(spots);
  }
}
