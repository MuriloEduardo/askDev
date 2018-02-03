import { User } from './../../../_interfaces/user';
import { Subscription } from 'rxjs/Subscription';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@AutoUnsubscribe()
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  subscriptionSearch: Subscription;
  userId = '0';
  user$: User;
  form: FormGroup;
  usersCol: AngularFirestoreCollection<User>;
  usersSearch: any;
  searchUpdated: Subject<string> = new Subject<string>();

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
    this.subscription = this.auth.user.subscribe(user => {
      if (user) {
        this.user$ = user;
        this.userId = this.user$.uid;
      }
    });

    this.subscriptionSearch = this.search(this.searchUpdated)
      .subscribe(results => {
        this.usersSearch = results;
      });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      nome: [null],
      senha: [null, [Validators.required]]
    });
  }

  private onSearchTyped(value: string) {
    this.searchUpdated.next(value);
  }

  search(terms: Observable<string>) {
    return terms.debounceTime(800)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    return this.afs.collection('users', ref => ref.where('email', '==', term)).valueChanges();
  }

  ngOnDestroy() {
  }

}
