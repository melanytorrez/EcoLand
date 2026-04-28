import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureFlagGuard } from './core/guards/feature-flag.guard';

import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    pathMatch: 'full',
    canActivate: [FeatureFlagGuard],
    data: { feature: 'inicio' }
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'reforestacion',
    loadChildren: () => import('./features/reforestacion/reforestacion.module').then(m => m.ReforestacionModule),
    canActivate: [FeatureFlagGuard],
    data: { feature: 'reforestacion' }
  },
  {
    path: 'reforestacion/:id',
    loadChildren: () => import('./features/campaigns/pages/user/campaign-detail/campaign-detail.module').then(m => m.CampaignDetailModule),
    canActivate: [FeatureFlagGuard],
    data: { feature: 'reforestacion' }
  },
  {
    path: 'campanas-reciclaje',
    loadChildren: () => import('./features/campañas-reciclaje/campañas-reciclaje.module').then(m => m.CampañasReciclajeModule),
    canActivate: [FeatureFlagGuard],
    data: { feature: 'campanasReciclaje' }
  },
  {
    path: 'campanas-reciclaje/:id',
    loadChildren: () => import('./features/recycling-campaign-detail/recycling-campaign-detail.module').then(m => m.RecyclingCampaignDetailModule),
    canActivate: [FeatureFlagGuard],
    data: { feature: 'campanasReciclaje' }
  },
  {
    path: 'reciclaje',
    loadChildren: () => import('./features/reciclaje/reciclaje.module').then(m => m.ReciclajeModule),
    canActivate: [FeatureFlagGuard],
    data: { feature: 'reciclaje' }
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./features/statistics/statistics.module').then(m => m.StatisticsModule),
    canActivate: [FeatureFlagGuard],
    data: { feature: 'estadisticas' }
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'campanas',
        loadChildren: () => import('./features/campaigns/pages/admin/campaign-form/campaign-form.module').then(m => m.CampaignFormModule)
      },
      {
        path: 'feature-toggles',
        loadChildren: () => import('./features/feature-toggles-admin/feature-toggles-admin-module').then(m => m.FeatureTogglesAdminModule)
      }
    ]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [FeatureFlagGuard],
    data: { feature: 'perfil' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
