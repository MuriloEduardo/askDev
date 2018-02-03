import { ToastrService } from 'ngx-toastr';
import { User } from './../_interfaces/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

  emailSignUp(email: string, password: string, displayName?: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.updateUserData(user, displayName);
      })
      .catch(error => this.handleError(error));
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.updateUserData(user);
      })
      .catch(error => this.handleError(error));
 }

  resetPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  completeLogin(redirect?: string) {
    this.router.navigate([redirect || '/']);
  }

  private handleError(error) {
    console.error('handleError', error);
    this.toastr.error(this.translateMessages(error), 'Putz!', {
      progressBar: true
    });
  }

  private translateMessages(error: any) {
    let returnMessage = '';
    switch (error.code) {
      case 'auth/user-not-found':
        returnMessage = 'Usuário não encontrado.';
        break;
      case 'auth/invalid-email':
        returnMessage = 'O endereço de e-mail está mal formatado.';
        break;
      case 'auth/wrong-password':
        returnMessage = 'A senha é inválida ou o usuário não possui uma senha.';
        break;
      default:
        returnMessage = 'Algo deu errado!';
        break;
    }
    return returnMessage;
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(result => {
        this.updateUserData(result.user);
      })
      .catch(error => this.handleError(error));
  }

  private updateUserData(user, displayName?: string) {
    if (!user) {
      return false;
    }
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName,
      photoURL: user.photoURL || 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
    };
    return userRef.set(data);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/auth']);
    });
  }
}
