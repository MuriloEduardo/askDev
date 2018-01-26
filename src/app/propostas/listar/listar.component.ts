import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Proposta } from './../../_interfaces/proposta';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Pergunta } from '../../_interfaces/pergunta';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  perguntaId: string;
  propostasCol: AngularFirestoreCollection<Proposta>;
  propostas$: any;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  pergunta: Observable<Pergunta>;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
) {

    this.perguntaId = this.route.snapshot.params['id'];

    this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
    this.pergunta = this.perguntaDoc.valueChanges();

    this.propostasCol = this.afs.collection('propostas', ref => ref.where('perguntaId', '==', this.perguntaId));

    this.propostas$ = this.propostasCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Proposta;
          const id = a.payload.doc.id;

          data.user = this.afs.collection('users').doc(data.userId).valueChanges();

          return { id, data };
        });
      });
  }

  ngOnInit() {
  }

  delete(id) {
    this.propostasCol.doc(id).delete().then(() => {
      console.log('deleted');
    });
  }

}
