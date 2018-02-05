import { User } from './../../_interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { PagamentosService } from './../pagamentos.service';
import { Pergunta } from './../../_interfaces/pergunta';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Mensagem } from '../../_interfaces/mensagem';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-garantia',
  templateUrl: './garantia.component.html',
  styleUrls: ['./garantia.component.scss']
})
export class GarantiaComponent implements OnInit, OnDestroy {

  onPagar: boolean;
  subUser: Subscription;
  subMensagem: Subscription;
  subPergunta: Subscription;
  mensagemDoc: AngularFirestoreDocument<Mensagem>;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  mensagem$: any;
  user$: User;
  mensagemId: string;
  perguntaId: string;
  pergunta$: Pergunta;
  mensagemFivePercent: number;
  metodosPgto = [
    {
      titulo: 'Cartão de Crédito',
      descricao: '100% online, comece agora!',
      sugerido: true,
      pagar: false
    },
    {
      titulo: 'Boleto Bancário',
      descricao: 'Pode demorar até 3 dias úteis através do MercadoPago \n 100% online',
      pagar: false
    },
    {
      titulo: 'MercadoPago',
      descricao: 'Use o crédito em sua conta para pagar',
      pagar: false
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AuthService,
    private pagamentosService: PagamentosService
  ) {

    this.subUser = this.auth.user.subscribe(user => {

      if (user) {
        this.user$ = user;
      }

      this.mensagemId = this.route.snapshot.params['mensagemId'];

      this.mensagemDoc = this.afs.doc('mensagens/' + this.mensagemId);
      this.subMensagem = this.mensagemDoc.valueChanges().subscribe((mensagem: Mensagem) => {
        if (mensagem) {
          this.mensagem$ = mensagem;
          this.mensagem$.user = this.afs.doc('users/' + this.mensagem$.userId).valueChanges();

          this.mensagemFivePercent = ((5 / 100) * this.mensagem$.valor) + this.mensagem$.valor;

          this.perguntaId = this.mensagem$.perguntaId;

          this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
          this.subPergunta = this.perguntaDoc.valueChanges().subscribe(pergunta => {
            if (pergunta) {
              this.pergunta$ = pergunta;
            }
          });
        }
      });
    });
  }

  pagar(index: number) {

    this.metodosPgto[index].pagar = true;

    const baseBackUrl = 'http://localhost:4200/pagamentos/resultado/' + this.mensagemId;

    const preferencia = {
      'items': [{
        'title': 'Garantia de proposta para a pergunta: ' + this.pergunta$.titulo,
        'quantity': 1,
        'currency_id': 'BRL',
        'unit_price': this.mensagemFivePercent
      }],
      'payer': {
        'name': this.user$.displayName,
        'email': this.user$.email
      },
      'payment_methods': {
        'installments': 1
      },
      'back_urls': {
        'success': baseBackUrl,
        'pending': baseBackUrl,
        'failure': baseBackUrl
      },
      'auto_return': 'all'
    };

    this.pagamentosService.create('/pagamentos/preferencias', preferencia)
      .then(data => {
        this.mensagemDoc.update({'preferenceId': data.response.id})
          .then(res => {
            window.location.href = data.response.sandbox_init_point;
          })
          .catch(error => console.error('createPreferencias', error));
      })
      .catch(error => console.error('pagar', error));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
