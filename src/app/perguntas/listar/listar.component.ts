import { User } from './../../user/user';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../pergunta/pergunta';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  perguntasCol: AngularFirestoreCollection<Pergunta>;
  perguntas$: any;
  user: User;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {

    this.auth.user.subscribe(user => {
      this.user = user;
    });

    this.perguntasCol = this.afs.collection('perguntas');

    this.perguntas$ = this.perguntasCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {

          const data = a.payload.doc.data() as Pergunta;
          const id = a.payload.doc.id;

          data.propostas = this.afs.collection('propostas', ref => ref.where('perguntaId', '==', id)).valueChanges();
          data.user = this.afs.collection('users').doc(data.user.uid).valueChanges();

          return { id, data };
        });
      });
  }

  ngOnInit() {
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
