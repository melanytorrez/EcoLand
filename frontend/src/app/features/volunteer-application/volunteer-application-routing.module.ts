import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VolunteerApplicationComponent } from './volunteer-application.component';

const routes: Routes = [
  { path: '', component: VolunteerApplicationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolunteerApplicationRoutingModule { }