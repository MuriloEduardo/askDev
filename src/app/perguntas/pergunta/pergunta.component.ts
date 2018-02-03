import { Mensagem } from './../../_interfaces/mensagem';
import { PerguntasService } from './../perguntas.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Proposta } from './../../_interfaces/proposta';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Pergunta } from './../../_interfaces/pergunta';
import { User } from './../../_interfaces/user';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/auth.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-pergunta',
  templateUrl: './pergunta.component.html',
  styleUrls: ['./pergunta.component.scss']
})
export class PerguntaComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('perguntaId') inputPerguntaId: string;
  @Output('userId') onUserId: EventEmitter<string> = new EventEmitter<string>();

  subscription: Subscription;
  subUserPropostaAceita: Subscription;

  perguntaId: string;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  pergunta$: Observable<Pergunta>;

  minhasPropostas$: Observable<any>;
  propostas$: Observable<Proposta[]>;
  propostaAceitaDoc: AngularFirestoreDocument<Mensagem>;
  propostaAceita$: Mensagem;
  propostasCol: AngularFirestoreCollection<Proposta>;

  usersCol: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user$: User;
  userId = '0';
  userCreator: Observable<User>;
  userPropostaAceita: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AuthService,
    private perguntasService: PerguntasService
  ) {

    this.perguntaId = this.inputPerguntaId || this.route.snapshot.params['perguntaId'];
    this.usersCol = this.afs.collection('users');

    // Usuario autenticado
    this.subscription = this.auth.user.subscribe(user => {

      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }

      // Pergunta
      this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
      this.pergunta$ = this.perguntaDoc.valueChanges();

      this.subscription = this.pergunta$.subscribe(pergunta => {
        // Usuario que criou a pergunta
        this.userDoc = this.usersCol.doc(pergunta.userId);
        this.userCreator = this.userDoc.valueChanges();

        if (pergunta.propostaAceita) {

          this.propostaAceitaDoc = this.afs.collection('mensagens').doc(pergunta.propostaAceita);

          this.subUserPropostaAceita = this.propostaAceitaDoc.valueChanges().subscribe(propostaAceita => {

            this.propostaAceita$ = propostaAceita;
            this.userPropostaAceita = this.usersCol.doc(this.propostaAceita$.userId).valueChanges();
          });
        }

        // Emit aos componentes que importam
        // O usuario que criou a pergunta
        this.onUserId.emit(pergunta.userId);
      });

      // Todas propostas de cada pergunta
      this.propostasCol = this.afs.collection('mensagens', ref => ref
        .where('perguntaId', '==', this.perguntaId)
        .where('valor', '>', 0)
      );
      this.propostas$ = this.propostasCol.valueChanges();

      // Minhas Propostas
      this.minhasPropostas$ = this.afs.collection('mensagens', ref => ref
        .where('perguntaId', '==', this.perguntaId)
        .where('userId', '==', this.userId)
        .where('valor', '>', 0)
      ).valueChanges();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
