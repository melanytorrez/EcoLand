import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'reforestacion',
    loadChildren: () => import('./features/reforestacion/reforestacion.module').then(m => m.ReforestacionModule)
  },
  {
    path: 'reforestacion/:id',
    loadChildren: () => import('./features/campaign-detail/campaign-detail.module').then(m => m.CampaignDetailModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
