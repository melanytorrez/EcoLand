import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { LucideAngularModule, Loader, UserCheck, Settings, UserPlus, Clock, Eye, CheckCircle, XCircle, Calendar, MapPin, Briefcase, FileText, Activity } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: UserManagementComponent }
];

@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ Loader, UserCheck, Settings, UserPlus, Clock, Eye, CheckCircle, XCircle, Calendar, MapPin, Briefcase, FileText, Activity }),
    TranslateModule
  ]
})
export class UserManagementModule { }
