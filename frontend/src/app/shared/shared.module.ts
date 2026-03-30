import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Leaf, LogIn, UserPlus, Shield, LogOut, User, TreeDeciduous, Recycle, TrendingUp, Users, MapPin, Calendar, Mail, Phone, Menu, X, Search, Filter, Clock, CheckCircle, Target, Award, Truck, Navigation, Lock, Plus, Edit, Trash2, Image, LayoutDashboard, Route, BarChart3 } from 'lucide-angular';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdminSidebarComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule.pick({ Leaf, LogIn, UserPlus, Shield, LogOut, User, TreeDeciduous, Recycle, TrendingUp, Users, MapPin, Calendar, Mail, Phone, Menu, X, Search, Filter, Clock, CheckCircle, Target, Award, Truck, Navigation, Lock, Plus, Edit, Trash2, Image, LayoutDashboard, Route, BarChart3 })
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdminSidebarComponent,
    AdminLayoutComponent,
    LucideAngularModule,
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
