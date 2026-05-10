import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { LucideAngularModule, User, Award, Calendar, TrendingUp, TreePine, Trash2, Send, Settings, UserPlus, Clock, X, Loader } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    BaseChartDirective,
    TranslateModule,
    FormsModule,
    LucideAngularModule.pick({ User, Award, Calendar, TrendingUp, TreePine, Trash2, Send, Settings, UserPlus, Clock, X, Loader })
  ]
})
export class ProfileModule { }
