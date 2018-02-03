import { User } from './../../_interfaces/user';
import { Subscription } from 'rxjs/Subscription';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../../_interfaces/pergunta';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@AutoUnsubscribe()
@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  userId = '0';
  user$: User;
  form: FormGroup;
  perguntasCol: AngularFirestoreCollection<Pergunta>;
  orcamentoArr = [
    'R$ 5,00 - 15,00',
    'R$ 1,00 - 5,00',
    'R$ 0,50 - 1,00'
  ];

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
    this.subscription = this.auth.user.subscribe(user => {
      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }
    });
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      titulo: [null, [Validators.required]],
      body: [null, [Validators.required]],
      orcamento: [null, [Validators.required]],
      categorias: [null, [Validators.required]],
    });

    this.perguntasCol = this.afs.collection('perguntas');
  }

  ngOnDestroy() {
  }

  onSubmit() {

    this.form.value.userId    = this.userId;
    this.form.value.status    = 0;
    this.form.value.createdAt = new Date();

    this.perguntasCol.add(this.form.value)
      .then((docRef) => {
        this.toastr.success('Sua pergunta foi postada!', 'Uhuul!');
        this.router.navigate(['/perguntas']);
      })
      .catch((error) => console.error('Error writing document: ', error));
  }

}
