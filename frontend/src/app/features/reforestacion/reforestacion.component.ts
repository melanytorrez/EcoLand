import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../core/services/campaign.service';
import { Campaign } from '../../core/models/campaign.model';

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

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.campaignService.getCampaigns().subscribe(campaigns => {
      this.campaigns = campaigns;
      this.filteredCampaigns = campaigns;
    });
  }

  filterCampaigns(): void {
    this.filteredCampaigns = this.campaigns.filter(campaign =>
      campaign.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  calculatePercentage(participants: number, total: number): number {
    return Math.round((participants / total) * 100);
  }
}
