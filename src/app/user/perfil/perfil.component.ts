import { ToastrService } from 'ngx-toastr';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from './../../_interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@AutoUnsubscribe()
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {

  userDoc: AngularFirestoreDocument<User>;
  subscription: Subscription;
  form: FormGroup;
  user$: User;

  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore
  ) {
    this.subscription = this.auth.user.subscribe(user => {

      if (user) {

        this.user$ = user;

        this.form.controls['nome'].patchValue(this.user$.nome || this.user$.displayName);

        this.userDoc = this.afs.collection('users').doc(this.user$.uid);
      }

    });
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      nome: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.userDoc.update({
      nome: this.form.value.nome
    })
      .then(() => this.toastr.success('Perfil atualizado!', 'Uhuul!'))
      .catch((error) => {
        console.error('Error writing document: ', error);
        this.toastr.error('Algo deu errado!', 'Vish!');
      });
  }

  ngOnDestroy() {
  }

}
