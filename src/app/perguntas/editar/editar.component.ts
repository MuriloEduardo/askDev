import { Pergunta } from './../../_interfaces/pergunta';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit, OnDestroy {

  perguntaId: string;
  pergunta$: Observable<Pergunta>;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute
  ) {
    this.perguntaId = this.route.snapshot.params['perguntaId'];
    this.pergunta$ = this.afs.doc<Pergunta>('perguntas/' + this.perguntaId).valueChanges();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
