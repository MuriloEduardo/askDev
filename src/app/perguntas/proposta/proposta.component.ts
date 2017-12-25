import { Observable } from 'rxjs/Observable';
import { Pergunta } from './../pergunta/pergunta';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from './../../auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Proposta } from './proposta';

@Component({
  selector: 'app-proposta',
  templateUrl: './proposta.component.html',
  styleUrls: ['./proposta.component.scss']
})
export class PropostaComponent implements OnInit {

  userId: string;
  perguntaId: string;
  form: FormGroup;
  propostasCol: AngularFirestoreCollection<Proposta>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder
  ) {

    this.perguntaId = this.route.snapshot.params['id'];

    this.propostasCol = this.afs.collection('propostas');

    this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
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
