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
		return this._firebaseAuth.auth.signInWithPopup(
			new firebase.auth.FacebookAuthProvider()
		);
	}

	isLoggedIn(): boolean {
		return !!localStorage.getItem('currentUser');
	}

	isAdmin(): boolean {
		// admin id
		return JSON.parse(localStorage.getItem('currentUser')).user.uid === '4h41P3l8XqYRW7YSBy3LA9pYGOt2';
	}

	isModerators(): boolean {
		const userId = JSON.parse(localStorage.getItem('currentUser')).user.uid;

		// Mati || Łukasz || Sobol
		const moderators = ['4h41P3l8XqYRW7YSBy3LA9pYGOt2', 'Gxhqkwmu0VfaMAsiWy6xSPj367z1', 'nCnHvhYvcubTEVxJ3cUfrJyg04P2'];
		return moderators.indexOf(userId) !== -1;
	}

	logout(): void {
		localStorage.removeItem('currentUser');
		this.router.navigate(['/login']);
	}

}
