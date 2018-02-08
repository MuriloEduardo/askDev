import { Movimentacao } from './../../_interfaces/movimentacao';
import { Observable } from 'rxjs/Observable';
import { Financas } from './../../_interfaces/financas';
import { AuthService } from './../../auth/auth.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../_interfaces/user';
import { Pergunta } from './../../_interfaces/pergunta';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Component, OnInit, OnDestroy } from '@angular/core';

@AutoUnsubscribe()
@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.scss']
})
export class MovimentacoesComponent implements OnInit, OnDestroy {

  user$: User;
  subscription: Subscription;
  perguntasCol: AngularFirestoreCollection<Pergunta>;
  financasCol: AngularFirestoreCollection<Financas>;
  userId = null;
  movimentacoes$: Observable<any>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {

    this.subscription = this.auth.user.subscribe(user => {

      if (user) {

        this.user$ = user;
        this.userId = this.user$.uid;

        this.financasCol = this.afs.doc('users/' + this.userId).collection('financas');

        this.financasCol.snapshotChanges()
          .take(1)
          .toPromise()
          .then(snaps => {

            if (snaps.length) {
              this.movimentacoes$ = this.financasCol.doc(snaps[0].payload.doc.id)
                .collection('movimentacoes').snapshotChanges()
                .map(movimentacoes => {
                  return movimentacoes.map(movimentacao => {

                    const data = movimentacao.payload.doc.data();

                    data.pergunta = this.afs.doc('perguntas/' + data.perguntaId).valueChanges();
                    data.user = this.afs.doc('users/' + data.userId).valueChanges();

                    return data;
                  });
                });
            }
          });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
