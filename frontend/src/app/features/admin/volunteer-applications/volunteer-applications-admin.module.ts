import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, CheckCircle2, Clock3, Loader2, MessageSquareText, XCircle, Leaf, BadgeInfo, Eye, User, Users, UserCheck, Settings, X } from 'lucide-angular';

import { VolunteerApplicationsAdminComponent } from './volunteer-applications-admin.component';

const routes: Routes = [
  { path: '', component: VolunteerApplicationsAdminComponent }
];

@NgModule({
  declarations: [VolunteerApplicationsAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule,
    LucideAngularModule.pick({ CheckCircle2, Clock3, Loader2, MessageSquareText, XCircle, Leaf, BadgeInfo, Eye, User, Users, UserCheck, Settings, X })
  ]
})
export class VolunteerApplicationsAdminModule { }