import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CampaignFormRoutingModule } from './campaign-form-routing.module';
import { CampaignFormComponent } from './campaign-form.component';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    CampaignFormComponent
  ],
  imports: [
    FormsModule,
    CampaignFormRoutingModule,
    SharedModule
  ]
})
export class CampaignFormModule { }
