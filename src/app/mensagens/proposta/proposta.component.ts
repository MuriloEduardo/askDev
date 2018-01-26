import { AuthService } from './../../auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensagem } from './../../_interfaces/mensagem';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-proposta',
  templateUrl: './proposta.component.html',
  styleUrls: ['./proposta.component.scss']
})
export class PropostaComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  perguntaId: string;
  mensagensCol: AngularFirestoreCollection<Mensagem>;
  userId: string;
  userToId: string;
  form: FormGroup;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder
  ) {

    this.subscription = this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.perguntaId = this.route.snapshot.params['perguntaId'];
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      body: [null, [Validators.required]],
      valorLiquido: [null, [Validators.required]],
      comissao: [null, [Validators.required]],
      total: [null, [Validators.required]]
    });

    this.mensagensCol = this.afs.collection('mensagens');
  }

  onUserToId(userToId: string) {
    console.log('onUserToId', userToId)
    this.userToId = userToId;
  }

  onSubmit() {

    this.form.value.userId     = this.userId;
    this.form.value.userToId   = this.userToId;
    this.form.value.perguntaId = this.perguntaId;
    this.form.value.createdAt  = new Date();

    console.log('onSubmit', this.form.value)

    this.mensagensCol.add(this.form.value)
      .then((docRef) => {
        console.log('Mensagem propostaComponent', docRef);
        this.router.navigate(['/perguntas']);
      })
      .catch((error) => console.error('Error writing document: ', error));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
