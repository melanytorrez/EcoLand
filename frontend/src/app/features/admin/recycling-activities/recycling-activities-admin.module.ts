import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { RecyclingActivitiesAdminComponent } from './recycling-activities-admin.component';

const routes: Routes = [
  { path: '', component: RecyclingActivitiesAdminComponent }
];

@NgModule({
  declarations: [RecyclingActivitiesAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class RecyclingActivitiesAdminModule { }
