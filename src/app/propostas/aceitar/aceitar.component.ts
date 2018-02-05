import { Pergunta } from './../../_interfaces/pergunta';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Mensagem } from '../../_interfaces/mensagem';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-aceitar',
  templateUrl: './aceitar.component.html',
  styleUrls: ['./aceitar.component.scss']
})
export class AceitarComponent implements OnInit, OnDestroy {

  subPergunta: Subscription;
  subMensagem: Subscription;
  mensagemDoc: AngularFirestoreDocument<Mensagem>;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  mensagem$: any;
  pergunta$: any;
  mensagemId: string;
  perguntaId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) {

    this.mensagemId = this.route.snapshot.params['mensagemId'];

    this.mensagemDoc = this.afs.doc('mensagens/' + this.mensagemId);
    this.subMensagem = this.mensagemDoc.valueChanges().subscribe((mensagem: Mensagem) => {
      if (mensagem) {
        this.mensagem$ = mensagem;
        this.mensagem$.user = this.afs.doc('users/' + this.mensagem$.userId).valueChanges();

        this.perguntaId = this.mensagem$.perguntaId;

        this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
        this.subPergunta = this.perguntaDoc.valueChanges().subscribe((pergunta: Pergunta) => {
          if (pergunta) {
            this.pergunta$ = pergunta;
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  cancelar() {
    this.router.navigate(['/propostas', this.perguntaId]);
  }

  updatePergunta() {
    this.perguntaDoc.update({
      status: 1,
      propostaAceita: this.mensagemId
    }).then(res => {
      this.router.navigate(['/pagamentos', 'garantia', this.mensagemId]);
    })
    .catch(error => console.error(error));
  }

}
