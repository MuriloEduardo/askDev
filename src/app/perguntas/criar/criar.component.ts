import { Observable } from 'rxjs/Observable';
import { PerguntasService } from './../perguntas.service';
import { User } from './../../_interfaces/user';
import { Subscription } from 'rxjs/Subscription';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Pergunta } from './../../_interfaces/pergunta';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@AutoUnsubscribe()
@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit, OnDestroy {

  @Input() perguntaId: string;
  @Input() pergunta$: Observable<Pergunta>;
  pergunta: Pergunta;
  subscription: Subscription;
  subPerguntas: Subscription;
  userId = '0';
  user$: User;
  form: FormGroup;
  perguntasCol: AngularFirestoreCollection<Pergunta>;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private perguntasService: PerguntasService
  ) {
    this.subscription = this.auth.user.subscribe(user => {
      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }
    });
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      titulo: [null, [
        Validators.required,
        Validators.maxLength(150)
      ]],
      body: [null, [Validators.required]],
      orcamento: [0, [Validators.required]],
      categorias: [[], [Validators.required]],
    });

    this.perguntasCol = this.afs.collection('perguntas');

    if (this.pergunta$) {
      this.subPerguntas = this.pergunta$.subscribe((pergunta: Pergunta) => {

        if (pergunta) {

          this.pergunta = pergunta;

          this.form.patchValue(this.pergunta);
        }
      });
    }

    this.dropdownList = [
      {'id': 1, 'itemName': 'India'},
      {'id': 2, 'itemName': 'Singapore'},
      {'id': 3, 'itemName': 'Australia'},
      {'id': 4, 'itemName': 'Canada'},
      {'id': 5, 'itemName': 'South Korea'},
      {'id': 6, 'itemName': 'Germany'},
      {'id': 7, 'itemName': 'France'},
      {'id': 8, 'itemName': 'Russia'},
      {'id': 9, 'itemName': 'Italy'},
      {'id': 10, 'itemName': 'Sweden'}
    ];
    this.selectedItems = [
      {'id': 2, 'itemName': 'Singapore'},
      {'id': 3, 'itemName': 'Australia'},
      {'id': 4, 'itemName': 'Canada'},
      {'id': 5, 'itemName': 'South Korea'}
    ];
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Selecione Categorias',
      selectAllText: 'Selecionar Tudo',
      unSelectAllText: 'Desmarcar Tudo',
      enableSearchFilter: true,
      classes: 'angular2-multiselect-dropdown',
      searchPlaceholderText: 'Buscar'
    };
  }

  ngOnDestroy() {
  }

  onSubmit() {

    if (this.form.invalid) {
      return;
    }

    this.form.value.userId    = this.userId;
    this.form.value.status    = 0;
    this.form.value.createdAt = new Date();

    this.upsert()
      .then(() => {
        this.toastr.success('Efetuado com sucesso!', 'Uhuul!');
        this.router.navigate(['/perguntas']);
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
        this.toastr.error('Algo deu errado!', 'Vish!');
      });
  }

  private upsert() {
    let returnProm;
    if (this.pergunta) {
      returnProm = this.perguntasCol.doc(this.perguntaId).update(this.form.value);
    } else {
      returnProm = this.perguntasCol.add(this.form.value);
    }
    return returnProm;
  }

}
