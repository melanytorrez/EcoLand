import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignFormComponent } from './campaign-form.component';

const routes: Routes = [
  { path: '', component: CampaignFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignFormRoutingModule { }
