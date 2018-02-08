import { User } from './../../_interfaces/user';
import { Pergunta } from './../../_interfaces/pergunta';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthService } from './../../auth/auth.service';
import { Mensagem } from './../../_interfaces/mensagem';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Conversa } from './../../_interfaces/conversa';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs/observable/forkJoin';

@AutoUnsubscribe()
@Component({
  selector: 'app-conversa',
  templateUrl: './conversa.component.html',
  styleUrls: ['./conversa.component.scss']
})
export class ConversaComponent implements OnInit, OnDestroy {

  subAuth: Subscription;
  subConversa: Subscription;
  subPergunta: Subscription;
  subRoute: Subscription;
  form: FormGroup;
  user$: User;
  userTo$: Observable<any>;

  pergunta$: any;
  perguntaId: string;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  userToHead$: Observable<any>;
  userToHeadCreator$: Observable<any>;
  userToId: string;

  conversaId: string;
  conversaDoc: AngularFirestoreDocument<Conversa>;
  conversa$: Conversa;

  mensagensCol: AngularFirestoreCollection<Mensagem>;
  mensagens$: Observable<any>;

  minhasPropostas$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {

    this.subAuth = this.auth.user.subscribe(user => {

      if (user) {

        this.user$ = user;

        this.subRoute = this.route.params.subscribe(params => {

          this.conversaId = params['conversaId'];

          this.conversaDoc = this.afs.doc('conversas/' + this.conversaId);

          this.subConversa = this.conversaDoc.valueChanges().subscribe(conversa => {

            if (conversa) {

              this.perguntaId = conversa.perguntaId;

              this.perguntaDoc = this.afs.doc('perguntas/' + conversa.perguntaId);

              this.subPergunta = this.perguntaDoc.valueChanges()
                .subscribe(pergunta => {
                  this.pergunta$ = pergunta;
                });

              this.userToHead$ = this.afs.collection('users').doc(conversa.userToId).valueChanges();
              this.userToHeadCreator$ = this.afs.collection('users').doc(conversa.userId).valueChanges();
              this.conversa$ = conversa;
              this.userToId = conversa.userToId;
            }
          });

          this.mensagensCol = this.afs.collection('mensagens', ref => ref
            .where('conversaId', '==', this.conversaId)
            .orderBy('createdAt')
          );

          this.mensagens$ = this.mensagensCol.snapshotChanges()
            .map(actions => {
              return actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;

                data.user = this.afs.collection('users').doc(data.userId).valueChanges();

                return { id, data };
              });
            });

          this.minhasPropostas$ = this.afs.collection('mensagens', ref => ref
            .where('conversaId', '==', this.conversaId)
            .where('userId', '==', this.user$.uid)
            .where('valor', '>', 0)
          ).valueChanges();
        });
      }
    });
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      body: [null, [Validators.required]]
    });
  }

  onSubmit() {

    if (this.form.invalid) {
      return false;
    }

    this.form.value.conversaId = this.conversaId;
    this.form.value.userId     = this.user$.uid;
    this.form.value.userToId   = this.userToId;
    this.form.value.perguntaId = this.perguntaId;
    this.form.value.createdAt  = new Date();

    this.mensagensCol.add(this.form.value)
      .then(mensagem => {
        this.form.reset();
      })
      .catch((error) => console.error('Error writing document: ', error));
  }

  private updateStatus(status: number) {
    this.perguntaDoc.update({ 'status': status });
  }

  ngOnDestroy() {
  }

}
