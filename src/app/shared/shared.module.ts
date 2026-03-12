import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, LogIn, UserPlus, Shield, LogOut, User, TreeDeciduous, Recycle, TrendingUp, Users, MapPin, Calendar, Mail, Phone, Menu, X, Lock } from 'lucide-angular';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule.pick({ Leaf, LogIn, UserPlus, Shield, LogOut, User, TreeDeciduous, Recycle, TrendingUp, Users, MapPin, Calendar, Mail, Phone, Menu, X, Lock })
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LucideAngularModule,
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
