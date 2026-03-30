import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignDetailRoutingModule } from './campaign-detail-routing.module';
import { CampaignDetailComponent } from './campaign-detail.component';
import { SharedModule } from '../../../../../shared/shared.module';


@NgModule({
  declarations: [
    CampaignDetailComponent
  ],
  imports: [
    CommonModule,
    CampaignDetailRoutingModule,
    SharedModule
  ]
})
export class CampaignDetailModule { }
