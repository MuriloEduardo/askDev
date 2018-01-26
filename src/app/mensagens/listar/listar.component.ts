import { User } from './../../_interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Mensagem } from './../../_interfaces/mensagem';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  mensagensCol: AngularFirestoreCollection<Mensagem>;
  mensagens$: any;
  user: User;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {

    this.subscription = this.auth.user.subscribe(user => {
    
      this.user = user;
    
      this.mensagensCol = this.afs.collection('mensagens', ref => ref.where('userToId', '==', this.user.uid));

      this.mensagens$ = this.mensagensCol.snapshotChanges()
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
