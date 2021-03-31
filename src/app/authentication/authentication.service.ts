import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
	private user: Observable<firebase.User>;
	public userDetails: firebase.User = null;

	constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
		this.user = _firebaseAuth.authState;
		this.authenticate();
	}

	authenticate(): void {
		this.user.subscribe((user) => {
			if (user) {
				this.userDetails = user;
			}
		});
	}

	signInWithFacebook(): Promise<firebase.auth.UserCredential> {
		return this._firebaseAuth.signInWithPopup(
			new firebase.auth.FacebookAuthProvider()
		);
	}

	createUser(email: string, password: string) {
		return this._firebaseAuth.createUserWithEmailAndPassword(email, password).then((credentials => {
			return credentials;
		}));
	}

	signIn(email: string, password: string) {
		return this._firebaseAuth.signInWithEmailAndPassword(email, password).then((credentials) => {
			return credentials;
		})
	}

	isLoggedIn(): boolean {
		return !!localStorage.getItem('currentUser');
	}

	isAdmin(): boolean {
		// admin id
		return JSON.parse(localStorage.getItem('currentUser')).user.uid === '5f0StLUdrFQkqTfy4Fbzahx26592';
	}

	isModerators(): boolean {
		const userId = JSON.parse(localStorage.getItem('currentUser')).user.uid;

		// Mati || Łukasz || Sobol
		const moderators = ['5f0StLUdrFQkqTfy4Fbzahx26592', 'S92wzyyzU5aAUgNjlS6EN1OJQVh2', 'QScmRVQyJ5VyyYu0r8wDU4Ybasi2'];
		return moderators.indexOf(userId) !== -1;
	}

	logout(): void {
		localStorage.removeItem('currentUser');
		this.router.navigate(['/login']);
	}

}
