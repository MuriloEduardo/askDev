import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from './../../../_interfaces/user';
import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Conversa } from './../../../_interfaces/conversa';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';

@AutoUnsubscribe()
@Component({
  selector: 'app-lista-conversas',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  conversasCol: AngularFirestoreCollection<Conversa>;
  conversas$: any;
  user$: User;
  userId = '0';

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {

    this.subscription = this.auth.user.subscribe(user => {

      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }

      this.conversasCol = this.afs.collection('conversas', ref => ref.where('userToId', '==', this.userId));

      this.conversas$ = this.conversasCol.snapshotChanges()
        .map(actions => {
          return actions.map(a => {

            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            data.user = this.afs.collection('users').doc(data.userId).valueChanges();
            data.pergunta = this.afs.collection('perguntas').doc(data.perguntaId).valueChanges();

            return { id, data };
          });
        });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
