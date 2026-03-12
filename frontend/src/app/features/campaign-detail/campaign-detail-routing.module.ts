import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignDetailComponent } from './campaign-detail.component';

const routes: Routes = [
  { path: '', component: CampaignDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignDetailRoutingModule { }
