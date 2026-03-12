import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampañasReciclajeComponent } from './campañas-reciclaje.component';

const routes: Routes = [
  { path: '', component: CampañasReciclajeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampañasReciclajeRoutingModule { }
