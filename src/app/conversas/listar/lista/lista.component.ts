import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from './../../../_interfaces/user';
import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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

  @Output() naoLidas: EventEmitter<number> = new EventEmitter<number>();
  subscription: Subscription;
  conversasCol: AngularFirestoreCollection<Conversa>;
  conversas$: any;
  user$: User;
  userId = null;
  naoLidas$ = 0;

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

            if (!data.lida) {
              this.naoLidas$++;
            } else {
              if (this.naoLidas$) {
                this.naoLidas$--;
              }
            }

            this.naoLidas.emit(this.naoLidas$);

            data.user = this.afs.collection('users').doc(data.userId).valueChanges();
            data.pergunta = this.afs.collection('perguntas').doc(data.perguntaId).valueChanges();

            return { id, data };
          });
        });
    });
  }

  private conversaLida(conversaId: string) {

    this.afs.doc('conversas/' + conversaId).update({
      lida: true,
      lidaAt: new Date()
    })
      .catch(error => console.error('conversaLida', error));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
