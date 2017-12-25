import { AuthService } from './../../auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Proposta } from './../proposta/proposta';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Pergunta } from './pergunta';

@Component({
  selector: 'app-pergunta',
  templateUrl: './pergunta.component.html',
  styleUrls: ['./pergunta.component.scss']
})
export class PerguntaComponent implements OnInit {

  perguntaId: string;
  perguntaTitulo: string;
  propostasCol: AngularFirestoreCollection<Proposta>;
  perguntaDoc: AngularFirestoreDocument<Pergunta>;
  pergunta: Observable<Pergunta>;
  propostas: Observable<Proposta[]>;
  linkBack: any;
  userId: string;
  form: FormGroup;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder
  ) {

    this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.perguntaId = this.route.snapshot.params['id'];
    this.perguntaTitulo = this.route.snapshot.params['titulo'];

    this.perguntaDoc = this.afs.doc('perguntas/' + this.perguntaId);
    this.pergunta = this.perguntaDoc.valueChanges();

    this.propostasCol = this.afs.collection('propostas', ref => ref.where('perguntaId', '==', this.perguntaId));
    this.propostas = this.propostasCol.valueChanges();
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      body: [null, [Validators.required]],
      valorLiquido: [null, [Validators.required]],
      comissao: [null, [Validators.required]],
      total: [null, [Validators.required]]
    });
  }

  onSubmit() {

    this.form.value.userId     = this.userId;
    this.form.value.perguntaId = this.perguntaId;
    this.form.value.createdAt  = new Date();

    this.propostasCol.add(this.form.value)
      .then((docRef) => {
        this.router.navigate(['/perguntas']);
      })
      .catch((error) => console.error('Error writing document: ', error));
  }

}
