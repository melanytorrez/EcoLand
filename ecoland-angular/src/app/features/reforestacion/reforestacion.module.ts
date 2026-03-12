import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReforestacionRoutingModule } from './reforestacion-routing.module';
import { ReforestacionComponent } from './reforestacion.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ReforestacionComponent
  ],
  imports: [
    CommonModule,
    ReforestacionRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ReforestacionModule { }
