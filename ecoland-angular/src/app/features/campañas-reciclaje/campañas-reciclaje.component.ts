import { Component, OnInit } from '@angular/core';
import { RecyclingCampaignService } from '../../core/services/recycling-campaign.service';
import { RecyclingCampaign } from '../../core/models/recycling-campaign.model';

@Component({
  selector: 'app-campanas-reciclaje',
  templateUrl: './campañas-reciclaje.component.html',
  styleUrl: './campañas-reciclaje.component.css',
  standalone: false
})
export class CampañasReciclajeComponent implements OnInit {
  campaigns: RecyclingCampaign[] = [];
  filteredCampaigns: RecyclingCampaign[] = [];
  searchTerm: string = '';

  constructor(private recyclingCampaignService: RecyclingCampaignService) {}

  ngOnInit(): void {
    this.recyclingCampaignService.getCampaigns().subscribe(campaigns => {
      this.campaigns = campaigns;
      this.filteredCampaigns = campaigns;
    });
  }

  filterCampaigns(): void {
    this.filteredCampaigns = this.campaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      campaign.wasteType.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  calculatePercentage(collected: number, goal: number): number {
    return Math.round((collected / goal) * 100);
  }

  getTypeColorClasses(color: string): { bg: string; text: string } {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      green: { bg: 'bg-green-100', text: 'text-green-700' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-700' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
    };
    return colors[color] || colors['green'];
  }
}
