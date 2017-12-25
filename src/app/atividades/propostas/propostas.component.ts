import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Proposta } from './../../perguntas/proposta/proposta';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-propostas',
  templateUrl: './propostas.component.html',
  styleUrls: ['./propostas.component.scss']
})
export class PropostasComponent implements OnInit {

  perguntaId: string;
  propostasCol: AngularFirestoreCollection<Proposta>;
  propostas$: any;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
) {

    this.perguntaId = this.route.snapshot.params['id'];

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
