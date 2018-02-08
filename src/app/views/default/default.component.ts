import { User } from './../../_interfaces/user';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

@AutoUnsubscribe()
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy {

  user$: User;
  subscription: Subscription;
  naoLidas = 0;

  constructor(private auth: AuthService) {
    this.subscription = this.auth.user.subscribe(user => {
      if (user) {
        this.user$ = user;
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  logout() {
    this.auth.signOut();
  }

  onNaoLidas(event) {
    this.naoLidas = event;
  }

}
