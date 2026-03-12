import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecyclingCampaignDetailComponent } from './recycling-campaign-detail.component';

const routes: Routes = [
  { path: '', component: RecyclingCampaignDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecyclingCampaignDetailRoutingModule { }
