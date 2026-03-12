import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecyclingCampaignDetailRoutingModule } from './recycling-campaign-detail-routing.module';
import { RecyclingCampaignDetailComponent } from './recycling-campaign-detail.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    RecyclingCampaignDetailComponent
  ],
  imports: [
    CommonModule,
    RecyclingCampaignDetailRoutingModule,
    SharedModule
  ]
})
export class RecyclingCampaignDetailModule { }
