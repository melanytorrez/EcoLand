import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../core/services/campaign.service';
import { Campaign } from '../../../../../core/models/campaign.model';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
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
}
