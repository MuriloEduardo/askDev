import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { AuthComponent } from './auth.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { SigninComponent } from './signin/signin.component';
import { WhereComponent } from './where/where.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { LoginSocialComponent } from './login-social/login-social.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthComponent,
    SigninComponent,
    WhereComponent,
    SignupComponent,
    LoginSocialComponent
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  exports: [
    LoginSocialComponent
  ]
})
export class AuthModule { }
