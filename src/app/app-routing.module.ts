import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
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
  },
  {
    path: 'campanas-reciclaje',
    loadChildren: () => import('./features/campañas-reciclaje/campañas-reciclaje.module').then(m => m.CampañasReciclajeModule)
  },
  {
    path: 'campanas-reciclaje/:id',
    loadChildren: () => import('./features/recycling-campaign-detail/recycling-campaign-detail.module').then(m => m.RecyclingCampaignDetailModule)
  },
  {
    path: 'reciclaje',
    loadChildren: () => import('./features/reciclaje/reciclaje.module').then(m => m.ReciclajeModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./features/statistics/statistics.module').then(m => m.StatisticsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
