import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureTogglesAdmin } from './feature-toggles-admin';

const routes: Routes = [
  { path: '', component: FeatureTogglesAdmin }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureTogglesAdminRoutingModule { }
