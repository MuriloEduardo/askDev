import { Pergunta } from './../../_interfaces/pergunta';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Mensagem } from '../../_interfaces/mensagem';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

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
  financasCol: AngularFirestoreCollection<any>;
  movimentacoesCol: AngularFirestoreCollection<any>;
  mensagem$: any;
  mensagemId: string;
  perguntaId: string;
  collection_status: string;
  pergunta$: Pergunta;
  userId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) {

    this.mensagemId = this.route.snapshot.params['mensagemId'];
    this.collection_status = this.route.snapshot.queryParams['collection_status'];

    this.financasCol = this.afs.collection('financas');
    this.movimentacoesCol = this.afs.collection('movimentacoes');

    this.mensagemDoc = this.afs.doc('mensagens/' + this.mensagemId);
    this.subMensagem = this.mensagemDoc.valueChanges().subscribe((mensagem: Mensagem) => {

      if (mensagem) {

        this.userId = mensagem.userId;

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

        this.mensagem$ = mensagem;
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

  ngOnInit() {
  }

  private updateStatus(status: number) {

    if (this.pergunta$ && this.pergunta$.status !== status) {

      this.perguntaDoc.update({'status': status})
        .catch(error => console.error(error));
    }
  }

  private financasUser() {

    console.log('financasUser')

    this.financasCol.ref.get().then(financas => {

      financas.forEach(financa => {

        const data = financa.data();
        const id = financa.id;

        console.log(data)

        if (data.userId === this.userId) {

          this.createMovimentacoes(id);
          console.log('if')
        } else {
          console.log('else')
          this.financasCol.add({userId: this.userId})
            .then(dataAdd => {

              const financasId = dataAdd.id;

              this.afs.doc('users/' + this.userId).update({financasId: financasId})
                .then(() => this.createMovimentacoes(financasId))
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        }
      });
    });
  }

  private createMovimentacoes(financasId: string) {

    this.movimentacoesCol.add({
      perguntaId: this.perguntaId,
      userId: this.mensagem$.userId,
      createdAt: new Date(),
      financasId: financasId,
      valor: this.mensagem$.valor
    }).catch(error => console.error(error));
  }

  ngOnDestroy() {
  }

}
