import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReforestacionComponent } from './reforestacion.component';

const routes: Routes = [
  { path: '', component: ReforestacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReforestacionRoutingModule { }
