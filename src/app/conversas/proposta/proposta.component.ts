import { User } from './../../_interfaces/user';
import { Pergunta } from './../../_interfaces/pergunta';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthService } from './../../auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Conversa } from './../../_interfaces/conversa';
import { Mensagem } from './../../_interfaces/mensagem';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@AutoUnsubscribe()
@Component({
  selector: 'app-proposta',
  templateUrl: './proposta.component.html',
  styleUrls: ['./proposta.component.scss']
})
export class PropostaComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  perguntaId: string;
  conversasCol: AngularFirestoreCollection<Conversa>;
  mensagensCol: AngularFirestoreCollection<Mensagem>;
  perguntasCol: AngularFirestoreCollection<Pergunta>;
  user$: User;
  userToId: string;
  form: FormGroup;
  conversas$: any;
  add: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder
  ) {

    this.perguntaId = this.route.snapshot.params['perguntaId'];
    this.add = this.route.snapshot.queryParams['add'];

    this.conversasCol = this.afs.collection('conversas');
    this.mensagensCol = this.afs.collection('mensagens');
    this.perguntasCol = this.afs.collection('perguntas');

    this.subscription = this.auth.user.subscribe(user => {

      if (user) {

        this.user$ = user;

        this.conversasCol.ref.get().then(conversas => {

          conversas.forEach(conversa => {

            const data = conversa.data();
            const id = conversa.id;

            if (
              data.userId === this.user$.uid &&
              data.userToId === this.userToId &&
              data.perguntaId === this.perguntaId
            ) {
              this.conversas$ = { id, data };
            }
          });
        });
      }
    });
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      mensagem: [null, [Validators.required]],
      valorLiquido: [null],
      comissao: [null],
      total: [null]
    });
  }

  onUserToId(userToId: string) {

    this.userToId = userToId;
  }

  onSubmit() {

    if (!this.add) {
      this.form.controls['valorLiquido'].setValidators([Validators.required]);
    }

    if (this.form.invalid) {
      return false;
    }

    const newConversa = {
      userId: this.user$.uid,
      userToId: this.userToId,
      perguntaId: this.perguntaId,
      createdAt: new Date()
    };

    const newMensagem = {
      userId: this.user$.uid,
      userToId: this.userToId,
      body: this.form.value.mensagem,
      valor: this.form.value.valorLiquido,
      perguntaId: this.perguntaId,
      createdAt: new Date()
    };

    if (this.conversas$) {

      // E adiciona mensagem
      newMensagem['conversaId'] = this.conversas$.id;
      this.addMensagem(newMensagem, this.conversas$.id);
    } else {

      /// Cria conversa
      this.conversasCol.add(newConversa)
        .then(conversa => {

          /// E adiciona mensagem
          newMensagem['conversaId'] = conversa.id;
          this.addMensagem(newMensagem, conversa.id);
        })
        .catch((error) => console.error('Error writing document: ', error));
    }
  }

  addMensagem(newMensagem, conversaId) {
    this.mensagensCol.add(newMensagem)
      .then(mensagem => {
        this.router.navigate(['/perguntas']);
      })
      .catch((error) => console.error('Error writing document: ', error));
  }

  ngOnDestroy() {
  }

}
