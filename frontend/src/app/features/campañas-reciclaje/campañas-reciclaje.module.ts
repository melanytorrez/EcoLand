import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CampañasReciclajeRoutingModule } from './campañas-reciclaje-routing.module';
import { CampañasReciclajeComponent } from './campañas-reciclaje.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CampañasReciclajeComponent
  ],
  imports: [
    CommonModule,
    CampañasReciclajeRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class CampañasReciclajeModule { }
