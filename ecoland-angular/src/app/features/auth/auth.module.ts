import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Leaf, Mail, Lock, User } from 'lucide-angular';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    LoginComponent,
    RegisterComponent,
    LucideAngularModule.pick({ Leaf, Mail, Lock, User })
  ]
})
export class AuthModule { }