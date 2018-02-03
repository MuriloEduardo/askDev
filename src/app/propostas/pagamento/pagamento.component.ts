import { Pergunta } from './../../_interfaces/pergunta';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Mensagem } from '../../_interfaces/mensagem';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit, OnDestroy {

  subMensagem: Subscription;
  mensagemDoc: AngularFirestoreDocument<Mensagem>;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  mensagem$: any;
  mensagemId: string;
  perguntaId: string;
  pergunta$: any;
  mensagemFivePercent: number;
  metodosPgto = [
    {
      titulo: 'Cartão de Crédito',
      descricao: '100% online, comece agora!',
      link: '#',
      sugerido: true
    },
    {
      titulo: 'Boleto Bancário',
      descricao: 'Pode demorar até 3 dias úteis através do MercadoPago \n 100% online',
      link: '#'
    },
    {
      titulo: 'MercadoPago',
      descricao: 'Use o crédito em sua conta para pagar',
      link: '#'
    }
  ];

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

        this.mensagemFivePercent = ((5 / 100) * this.mensagem$.valor) + this.mensagem$.valor;

        this.perguntaId = this.mensagem$.perguntaId;

        this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
        this.pergunta$ = this.perguntaDoc.valueChanges();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
