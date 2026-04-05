import { Component, OnInit } from '@angular/core';
import { Campaign } from '../../core/models/campaign.model';
import { CampaignService } from '../../core/services/campaign.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})
export class HomeComponent implements OnInit {
  stats = [
    { icon: 'tree-deciduous', label: 'Árboles Plantados', value: '15,432' },
    { icon: 'recycle', label: 'Kg Reciclados', value: '328,567' },
    { icon: 'users', label: 'Voluntarios Activos', value: '1,856' },
    { icon: 'trending-up', label: 'Campañas Activas', value: '24' },
  ];

  campaigns: Campaign[] = [];

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns.slice(0, 3);
      },
      error: () => {
        this.campaigns = [];
      }
    });
  }

  getSpotCount(spots: number): string {
    return String(spots);
  }
}
