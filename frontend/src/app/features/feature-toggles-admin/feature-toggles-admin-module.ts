import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { FeatureTogglesAdminRoutingModule } from './feature-toggles-admin-routing-module';
import { FeatureTogglesAdmin } from './feature-toggles-admin';


@NgModule({
  declarations: [
    FeatureTogglesAdmin
  ],
  imports: [
    CommonModule,
    SharedModule,
    FeatureTogglesAdminRoutingModule
  ]
})
export class FeatureTogglesAdminModule { }
