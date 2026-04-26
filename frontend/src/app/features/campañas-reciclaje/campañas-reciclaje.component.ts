import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../core/services/campaign.service';
import { RecyclingCampaign } from '../../core/models/recycling-campaign.model';
import { Campaign } from '../../core/models/campaign.model';

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

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.campaignService.getCampaigns('RECYCLING').subscribe((campaigns: Campaign[]) => {
      const mapped = campaigns.map(c => ({
        id: c.id,
        image: c.image,
        name: c.title,
        wasteType: 'Reciclaje',
        date: c.date,
        location: c.location,
        goal: `${c.spots} kg`,
        collected: c.participants,
        goalAmount: c.spots,
        status: c.status,
        participants: c.participants,
        typeColor: 'green'
      } as RecyclingCampaign));
      this.campaigns = mapped;
      this.filteredCampaigns = mapped;
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
