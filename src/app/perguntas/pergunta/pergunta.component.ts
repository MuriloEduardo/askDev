import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Proposta } from './../../_interfaces/proposta';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Pergunta } from './../../_interfaces/pergunta';
import { User } from './../../_interfaces/user';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pergunta',
  templateUrl: './pergunta.component.html',
  styleUrls: ['./pergunta.component.scss']
})
export class PerguntaComponent implements OnInit, OnDestroy {

  @Input('perguntaId') inputPerguntaId: string;

  subscription: Subscription;

  perguntaId: string;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  pergunta: Observable<Pergunta>;
  
  propostas: Observable<Proposta[]>;
  propostasCol: AngularFirestoreCollection<Proposta>;
  
  @Output() userId: EventEmitter<string> = new EventEmitter<string>();
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) {

    this.perguntaId = this.inputPerguntaId || this.route.snapshot.params['perguntaId'];

    this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
    this.pergunta = this.perguntaDoc.valueChanges();

    this.subscription = this.pergunta.subscribe(pergunta => {
      this.userDoc = this.afs.collection('users').doc(pergunta.user.uid);
      this.userId.emit(pergunta.user.uid);
      this.user = this.userDoc.valueChanges();
    });

    this.propostasCol = this.afs.collection('propostas', ref => ref.where('perguntaId', '==', this.perguntaId));
    this.propostas = this.propostasCol.valueChanges();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
