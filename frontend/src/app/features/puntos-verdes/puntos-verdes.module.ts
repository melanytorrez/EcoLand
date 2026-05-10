import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PuntosVerdesRoutingModule } from './puntos-verdes-routing.module';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CatalogoComponent,
    DetalleComponent
  ],
  imports: [
    CommonModule,
    PuntosVerdesRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class PuntosVerdesModule { }
