import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { LucideAngularModule, User, Award, Calendar, TrendingUp, TreePine, Trash2 } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    BaseChartDirective,
    TranslateModule,
    LucideAngularModule.pick({ User, Award, Calendar, TrendingUp, TreePine, Trash2 })
  ]
})
export class ProfileModule { }
