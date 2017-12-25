import { User } from './../../user/user';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../../perguntas/pergunta/pergunta';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-ajudado',
  templateUrl: './ajudado.component.html',
  styleUrls: ['./ajudado.component.scss']
})
export class AjudadoComponent implements OnInit {

  perguntasCol: AngularFirestoreCollection<Pergunta>;
  perguntas$: any;
  user: User;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) {

    this.auth.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.perguntasCol = this.afs.collection('perguntas');

    this.perguntas$ = this.perguntasCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Pergunta;
          const id = a.payload.doc.id;

          data.propostas = this.afs.collection('propostas', ref => ref.where('perguntaId', '==', id)).valueChanges();
          data.user = this.afs.collection('users').doc(this.user.uid).valueChanges();

          return { id, data };
        });
      });
  }

  ngOnInit() {
  }

}
