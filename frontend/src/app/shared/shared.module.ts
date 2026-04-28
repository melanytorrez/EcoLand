import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { 
  LucideAngularModule, Leaf, LogIn, UserPlus, Shield, LogOut, User, 
  TreeDeciduous, Recycle, TrendingUp, Users, MapPin, Calendar, Mail, 
  Phone, Menu, X, Search, Filter, Clock, CheckCircle, Target, Award, 
  Truck, Navigation, Lock, Plus, Edit, Trash2, Image, LayoutDashboard, 
  Route, BarChart3, ChevronDown, Check, ToggleRight, TreePine, 
  Megaphone, Map, ToggleLeft, Droplets 
} from 'lucide-angular';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { IfFeatureDirective } from './directives/if-feature.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdminSidebarComponent,
    AdminLayoutComponent,
    IfFeatureDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LucideAngularModule.pick({ 
      Leaf, LogIn, UserPlus, Shield, LogOut, User, TreeDeciduous, Recycle, 
      TrendingUp, Users, MapPin, Calendar, Mail, Phone, Menu, X, Search, 
      Filter, Clock, CheckCircle, Target, Award, Truck, Navigation, Lock, 
      Plus, Edit, Trash2, Image, LayoutDashboard, Route, BarChart3, 
      ChevronDown, Check, ToggleRight, ToggleLeft, TreePine, Megaphone, 
      Map, Droplets 
    })
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdminSidebarComponent,
    AdminLayoutComponent,
    IfFeatureDirective,
    LucideAngularModule,
    CommonModule,
    RouterModule,
    TranslateModule
  ]
})
export class SharedModule { }
