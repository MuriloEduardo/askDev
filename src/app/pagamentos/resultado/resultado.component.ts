import { User } from './../../_interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../../_interfaces/pergunta';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Mensagem } from '../../_interfaces/mensagem';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Financas } from '../../_interfaces/financas';
import { Movimentacao } from '../../_interfaces/movimentacao';

@AutoUnsubscribe()
@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit, OnDestroy {

  subUser: Subscription;
  subMensagem: Subscription;
  subPergunta: Subscription;
  mensagemDoc: AngularFirestoreDocument<Mensagem>;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  userDoc: AngularFirestoreDocument<User>;
  financasCol: AngularFirestoreCollection<Financas>;
  movimentacoesCol: AngularFirestoreCollection<Movimentacao>;
  mensagem$: any;
  mensagemId: string;
  perguntaId: string;
  collection_status: string;
  pergunta$: Pergunta;
  userId: string;
  user$: User;
  preference_id: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AuthService
  ) {

    this.mensagemId = this.route.snapshot.params['mensagemId'];
    this.collection_status = this.route.snapshot.queryParams['collection_status'];
    this.preference_id = this.route.snapshot.queryParams['preference_id'];

    this.subUser = this.auth.user.subscribe(user => {
      if (user) {

        this.user$ = user;
        this.userDoc = this.afs.doc('users/' + this.user$.uid);
        this.financasCol = this.userDoc.collection<Financas>('financas');

        this.movimentacoesCol = this.afs.collection('movimentacoes');

        this.mensagemDoc = this.afs.doc('mensagens/' + this.mensagemId);
        this.subMensagem = this.mensagemDoc.valueChanges().subscribe((mensagem: Mensagem) => {

          if (mensagem) {

            this.userId = mensagem.userId;

            this.mensagem$ = mensagem;

            switch (this.collection_status) {
              case 'approved':
                this.updateStatus(2);
                this.financasUser();
                break;
              case 'pending':
                this.updateStatus(3);
                break;
              default:
                break;
            }

            // Usuario que criou a pergunta que movimentou dinheiro
            // Poder ser eu mesmo que pagauém alguém
            // Ou alguém que me pagou
            this.mensagem$.user = this.afs.doc('users/' + this.userId).valueChanges();

            this.perguntaId = this.mensagem$.perguntaId;

            this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
            this.subPergunta = this.perguntaDoc.valueChanges().subscribe(pergunta => {

              if (pergunta) {

                this.pergunta$ = pergunta;
              }
            });
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  private updateStatus(status: number) {

    if (this.pergunta$ && this.pergunta$.status !== status) {

      this.perguntaDoc.update({ 'status': status })
        .catch(error => console.error(error));
    }
  }

  private financasUser() {

    this.financasCol.snapshotChanges().take(1).toPromise()
      .then(snaps => {

        if (snaps.length) {

          this.createMovimentacoes(snaps[0].payload.doc.id);
        } else {

          this.financasCol.add({
            saque: null,
            creditCard: null
          })
            .then(financa => {
              this.createMovimentacoes(financa.id);
            })
            .catch(error => console.error('financasUser', error));
        }
      });
  }

  private createMovimentacoes(financasId: string) {

    if (!financasId) {
      return;
    }

    this.movimentacoesCol = this.financasCol.doc(financasId).collection<Movimentacao>('movimentacoes');

    this.movimentacoesCol.doc(this.preference_id).set({
      perguntaId: this.perguntaId,
      userId: this.mensagem$.userId,
      createdAt: new Date(),
      tipo: 0,
      valor: this.mensagem$.valor
    })
      .then(() => {})
      .catch(error => console.error('createMovimentacoes', error));
  }

  ngOnDestroy() {
  }

}
