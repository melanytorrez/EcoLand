import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LucideAngularModule, Plus, Search, Edit, Trash2, Clock, MapPin, X } from 'lucide-angular';

import { AdminPuntosVerdesComponent } from './admin-puntos-verdes.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminPuntosVerdesComponent }
];

@NgModule({
  declarations: [
    AdminPuntosVerdesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ Plus, Search, Edit, Trash2, Clock, MapPin, X })
  ]
})
export class PuntosVerdesAdminModule { }
