import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, ArrowLeft, CalendarDays, CheckCircle2, Leaf, Loader2, Phone, Send, Sprout, User, Clock3 } from 'lucide-angular';

import { VolunteerApplicationRoutingModule } from './volunteer-application-routing.module';
import { VolunteerApplicationComponent } from './volunteer-application.component';

@NgModule({
  declarations: [VolunteerApplicationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    VolunteerApplicationRoutingModule,
    LucideAngularModule.pick({ ArrowLeft, CalendarDays, CheckCircle2, Leaf, Loader2, Phone, Send, Sprout, User, Clock3 })
  ]
})
export class VolunteerApplicationModule { }