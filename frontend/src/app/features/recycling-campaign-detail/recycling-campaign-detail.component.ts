import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecyclingCampaignService } from '../../core/services/recycling-campaign.service';
import { RecyclingCampaign } from '../../core/models/recycling-campaign.model';

@Component({
  selector: 'app-recycling-campaign-detail',
  templateUrl: './recycling-campaign-detail.component.html',
  styleUrl: './recycling-campaign-detail.component.css',
  standalone: false
})
export class RecyclingCampaignDetailComponent implements OnInit {
  campaign: RecyclingCampaign | undefined;
  percentage: number = 0;
  toCollect: number = 0;

  constructor(
    private route: ActivatedRoute,
    private recyclingCampaignService: RecyclingCampaignService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id) {
      this.recyclingCampaignService.getCampaignById(id).subscribe(campaign => {
        this.campaign = campaign;
        if (this.campaign) {
          this.percentage = Math.round((this.campaign.collected / this.campaign.goalAmount) * 100);
          this.toCollect = this.campaign.goalAmount - this.campaign.collected;
        }
      });
    }
  }
}
