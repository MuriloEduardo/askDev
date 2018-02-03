import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../_interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Pergunta } from '../../_interfaces/pergunta';
import { Conversa } from '../../_interfaces/conversa';

@AutoUnsubscribe()
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  perguntaId: string;
  conversasCol: AngularFirestoreCollection<Conversa>;
  conversas$: any;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  pergunta: Observable<Pergunta>;
  user$: User;
  userId = '0';

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AuthService
) {

    this.subscription = this.auth.user.subscribe(user => {

      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }

      this.perguntaId = this.route.snapshot.params['perguntaId'];

      this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
      this.pergunta = this.perguntaDoc.valueChanges();

      this.conversasCol = this.afs.collection('conversas', ref => ref
        .where('userToId', '==', this.userId)
        .where('perguntaId', '==', this.perguntaId)
      );

      this.conversas$ = this.conversasCol.snapshotChanges()
        .map(actions => {
          return actions.map(a => {

            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            data.user = this.afs.collection('users').doc(data.userId).valueChanges();

            data.mensagens = this.afs.collection('mensagens', ref => ref
              .where('conversaId', '==', id)
              .where('perguntaId', '==', data.perguntaId)
              .where('userId', '==', data.userId)
              .where('userToId', '==', this.userId)
              .orderBy('createdAt')
            ).snapshotChanges()
            .map(mensagens => {
              return mensagens.map(b => {

                const dataMensagens = b.payload.doc.data();
                const idMensagens = b.payload.doc.id;

                return { idMensagens, dataMensagens };
              });
            });

            return { id, data };
          });
        });

    });
  }

  ultimaProposta(mensagens: any): any {

    let returnMensagem;

    mensagens.forEach(mensagem => {
      if (mensagem.dataMensagens.valor > 0) {
        returnMensagem = mensagem;
      }
    });

    return returnMensagem;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
