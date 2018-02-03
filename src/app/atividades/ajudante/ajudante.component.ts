import { PerguntasService } from './../../perguntas/perguntas.service';
import { User } from './../../_interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { Conversa } from './../../_interfaces/conversa';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-ajudante',
  templateUrl: './ajudante.component.html',
  styleUrls: ['./ajudante.component.scss']
})
export class AjudanteComponent implements OnInit {

  conversasCol: AngularFirestoreCollection<Conversa>;
  conversas$: any;
  user$: User;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private perguntasService: PerguntasService
  ) {

    this.auth.user.subscribe(user => {

      if (user) {

        this.user$ = user;

        this.conversasCol = this.afs.collection('conversas', ref => ref
          .where('userId', '==', this.user$.uid)
        );

        this.conversas$ = this.conversasCol.snapshotChanges()
          .map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;

              data.userTo = this.afs.collection('users').doc(data.userToId).valueChanges();

              data.pergunta = this.afs.collection('perguntas').doc(data.perguntaId).valueChanges();

              data.mensagens = this.afs.collection('mensagens', ref => ref
                .where('conversaId', '==', id)
              ).valueChanges();

              data.minhasPropostas = this.afs.collection('mensagens', ref => ref
                .where('perguntaId', '==', data.perguntaId)
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
