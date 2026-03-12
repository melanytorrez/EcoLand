import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReciclajeComponent } from './reciclaje.component';

const routes: Routes = [
  { path: '', component: ReciclajeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReciclajeRoutingModule { }
