import { AuthService } from './../../auth/auth.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../_interfaces/user';
import { Pergunta } from './../../_interfaces/pergunta';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Component, OnInit, OnDestroy } from '@angular/core';

@AutoUnsubscribe()
@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.scss']
})
export class MovimentacoesComponent implements OnInit, OnDestroy {

  user$: User;
  subscription: Subscription;
  subPerguntas: Subscription;
  subMensagem: Subscription;
  subUserTwo: Subscription;
  perguntasCol: AngularFirestoreCollection<Pergunta>;
  userId = '0';
  mensagens$: any[] = [];

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {

    this.subscription = this.auth.user.subscribe(user => {

      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }

      this.perguntasCol = this.afs.collection('perguntas', ref => ref
        .where('userId', '==', this.userId)
      );

      this.subPerguntas = this.perguntasCol.valueChanges().subscribe(perguntas => {
        perguntas.map(pergunta => {
          this.subMensagem = this.afs.doc('mensagens/' + pergunta.propostaAceita).valueChanges()
            .subscribe(mensagem => {
              this.subUserTwo = this.afs.doc('users/' + mensagem['userId']).valueChanges()
                .subscribe(userTwo => {
                  mensagem['pergunta'] = pergunta;
                  mensagem['user'] = userTwo;
                  this.mensagens$.push(mensagem);
                });
            });
        });
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
