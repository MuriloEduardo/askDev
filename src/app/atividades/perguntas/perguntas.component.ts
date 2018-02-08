import { PerguntasService } from './../../perguntas/perguntas.service';
import { User } from './../../_interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../../_interfaces/pergunta';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-perguntas',
  templateUrl: './perguntas.component.html',
  styleUrls: ['./perguntas.component.scss']
})
export class PerguntasComponent implements OnInit {

  perguntasCol: AngularFirestoreCollection<Pergunta>;
  perguntas$: any;
  user$: User;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private perguntasService: PerguntasService
  ) {

    this.auth.user.subscribe(user => {
      if (user) {

        this.user$ = user;

        this.perguntasCol = this.afs.collection('perguntas', ref => ref
          .where('userId', '==', this.user$.uid)
          .orderBy('createdAt', 'desc')
        );

        this.perguntas$ = this.perguntasCol.snapshotChanges()
          .map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;

              data.propostas = this.afs.collection('mensagens', ref => ref
                .where('perguntaId', '==', id)
                .where('valor', '>', 0)
              ).valueChanges();

              return { id, data };
            });
          });
      }
    });
  }

  ngOnInit() {
  }

}
