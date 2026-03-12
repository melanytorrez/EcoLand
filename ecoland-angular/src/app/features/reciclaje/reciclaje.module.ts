import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReciclajeRoutingModule } from './reciclaje-routing.module';
import { ReciclajeComponent } from './reciclaje.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ReciclajeComponent
  ],
  imports: [
    CommonModule,
    ReciclajeRoutingModule,
    SharedModule
  ]
})

export class ReciclajeModule { }
