import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Mensagem } from './../../_interfaces/mensagem';
import { PerguntasService } from './../perguntas.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Proposta } from './../../_interfaces/proposta';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  conversasCol: AngularFirestoreCollection<Proposta>;
  mensagensCol: AngularFirestoreCollection<Proposta>;
  form: FormGroup;
  usersCol: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user$: User;
  userId = null;
  userToId: string;
  userCreator: Observable<User>;
  userPropostaAceita: Observable<any>;
  conversas$: any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AuthService,
    private perguntasService: PerguntasService,
    private formBuilder: FormBuilder
  ) {

    this.perguntaId = this.route.snapshot.params['perguntaId'];
    this.usersCol = this.afs.collection('users');
    this.conversasCol = this.afs.collection('conversas');
    this.mensagensCol = this.afs.collection('mensagens');

    // Usuario autenticado
    this.subscription = this.auth.user.subscribe(user => {

      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;

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

        this.userToId = pergunta.userId;
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
        .orderBy('createdAt')
      ).snapshotChanges()
        .map(actions => {
          const returnActions = actions.map(a => {

            const data = a.payload.doc.data();

            if (data.valor > 0) {
              return data;
            }
          });

          const returnReformedAction = [];
          returnActions.forEach(returnAction => {
            if (returnAction) {
              returnReformedAction.push(returnAction);
            }
          });
          return returnReformedAction;
        });
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

  onValorLiquido() {
    const value = this.form.value.valorLiquido;
    const calcPercent = (10 / 100) * value;
    this.form.patchValue({
      comissao: calcPercent,
      total: value + calcPercent
    });
  }

  onSubmit() {

    if (this.form.invalid) {
      return;
    }

    const newConversa = {
      userId: this.user$.uid,
      userToId: this.userToId,
      perguntaId: this.perguntaId,
      lida: false,
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
        .catch((error) => {
          console.error('Error writing document: ', error);
          this.toastr.error('Algo deu errado!', 'Vish!');
        });
    }
  }

  addMensagem(newMensagem, conversaId) {
    this.mensagensCol.add(newMensagem)
      .then(mensagem => {
        this.toastr.success('Sua mensagem foi postada!', 'Uhuul!');
        this.router.navigate(['/perguntas']);
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
        this.toastr.error('Algo deu errado!', 'Vish!');
      });
  }

  ngOnDestroy() {
  }

}
