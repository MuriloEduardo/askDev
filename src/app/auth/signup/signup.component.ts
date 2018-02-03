import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: [null, [Validators.required]],
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      password: [null, [Validators.required]]
    });
  }

  signInWithGoogle() {
    this.auth.googleLogin()
      .then(res => this.auth.completeLogin());
  }

  onSubmit() {
    this.auth.emailSignUp(this.form.value.email, this.form.value.password, this.form.value.nome)
      .then(res => this.auth.completeLogin());
  }

}
