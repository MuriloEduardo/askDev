import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../pergunta/pergunta';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit {

  userId: string;
  form: FormGroup;
  perguntasCol: AngularFirestoreCollection<Pergunta>;
  orcamentoArr = [
    'R$ 5,00 - 15,00',
    'R$ 1,00 - 5,00',
    'R$ 0,50 - 1,00'
  ];

  constructor(
    private router: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
    this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      categoria: [null, [Validators.required]],
      subcategoria: [null, [Validators.required]],
      titulo: [null, [Validators.required]],
      body: [null, [Validators.required]],
      prazo: [null, [Validators.required]],
      orcamento: [null, [Validators.required]]
    });

    this.perguntasCol = this.afs.collection('perguntas');
  }

  onSubmit() {

    this.form.value.user = {
      uid: this.userId
    };

    this.form.value.createdAt = new Date();

    this.perguntasCol.add(this.form.value)
      .then((docRef) => {
        this.router.navigate(['/']);
      })
      .catch((error) => console.error('Error writing document: ', error));
  }

}
