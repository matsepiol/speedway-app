import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe( (user) => {
      if (user) {
        this.userDetails = user;
      }
    });
  }

  signInRegular(email: string, password: string) {
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }

  isLoggedIn() {
    if (!localStorage.getItem('currentUser')) {
      return false;
    } else {
      return true;
    }
  }

  isAdmin() {
    // admin id
    return JSON.parse(localStorage.getItem('currentUser')).user.uid === '4h41P3l8XqYRW7YSBy3LA9pYGOt2';
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
