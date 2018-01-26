import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Mensagem } from './../../_interfaces/mensagem';

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.component.html',
  styleUrls: ['./mensagem.component.scss']
})
export class MensagemComponent implements OnInit {

  perguntaDoc: AngularFirestoreDocument<Mensagem>;
  pergunta: Observable<Mensagem>;

  constructor() { }

  ngOnInit() {
  }

}
