import { Observable } from 'rxjs/Observable';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from './../../_interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../../_interfaces/pergunta';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

@AutoUnsubscribe()
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit, OnDestroy {

  user$: User;
  subscription: Subscription;
  subPerguntas: Subscription;
  perguntasCol: AngularFirestoreCollection<Pergunta>;
  perguntas$: Observable<any>;
  userId = '0';
  perguntas: Pergunta[] = [];

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {

    this.subscription = this.auth.user.subscribe(user => {

      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }

      this.perguntasCol = this.afs.collection('perguntas');

      this.perguntas$ = this.perguntasCol.snapshotChanges()
        .map(actions => {
          return actions.map(a => {

            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            data.propostas = this.afs.collection('mensagens', ref => ref
              .where('perguntaId', '==', id)
              .where('userToId', '==', data.userId)
              .where('valor', '>', 0)
            ).valueChanges();

            data.minhasPropostas = this.afs.collection('mensagens', ref => ref
              .where('perguntaId', '==', id)
              .where('userId', '==', this.userId)
              .where('userToId', '==', data.userId)
              .where('valor', '>', 0)
            ).valueChanges();

            data.user = this.afs.collection('users').doc(data.userId).valueChanges();

            data.conversa = this.afs.collection('conversas', ref => ref
              .where('perguntaId', '==', id)
              .where('userId', '==', this.userId)
              .where('userToId', '==', data.userId)
            ).snapshotChanges().map(conversa => {
              return conversa.map(b => {
                const dataConversa = b.payload.doc.data();
                const idConversa = b.payload.doc.id;

                return { idConversa, dataConversa };
              });
            });

            return { id, data };
          });
        });

      this.subPerguntas = this.perguntas$.subscribe(perguntas => {
        perguntas.map(pergunta => {
          if (pergunta.data.userId !== this.userId && !pergunta.data.status) {
            this.perguntas.push(pergunta);
          }
        });
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  especialCharMask(text) {
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    text = text.replace(new RegExp('[ ]', 'gi'), '-');
    return text.toLowerCase();
  }

}
