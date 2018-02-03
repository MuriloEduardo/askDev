import { AuthService } from './../auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login-social',
  templateUrl: './login-social.component.html',
  styleUrls: ['./login-social.component.scss']
})
export class LoginSocialComponent implements OnInit {

  @Input() redirect;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  signInWithGoogle() {
    this.auth.googleLogin()
      .then(() => this.auth.completeLogin(this.redirect));
  }

  signInWithFacebook() {
    this.auth.facebookLogin()
    .then(() => this.auth.completeLogin(this.redirect));
  }

  signInWithGithub() {
    this.auth.githubLogin()
      .then(() => this.auth.completeLogin(this.redirect));
  }

}
