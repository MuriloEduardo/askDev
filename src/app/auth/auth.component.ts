import { AuthService } from './auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../_interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.subscription = this.auth.user.subscribe((user: User) => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
