import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication/authentication.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	registerError: string;
	signInError: string;
	isRegisterLoading = false;
	isSignInLoading = false;

	registerForm: FormGroup;
	signInForm: FormGroup;

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.registerForm = new FormGroup({
			login: new FormControl(''),
			password: new FormControl('')
		});

		this.signInForm = new FormGroup({
			login: new FormControl(''),
			password: new FormControl('')
		});
	}

	public signInWithLoginAndPassword() {
		this.isSignInLoading = true;
		this.authenticationService.signIn(
			this.signInForm.controls.login.value,
			this.signInForm.controls.password.value
		).then(res => {
			this.isSignInLoading = false;
			this.signInError = null;
			localStorage.setItem('currentUser', JSON.stringify(res));
			this.authenticationService.authenticate();
			this.router.navigate(['/']);
			setTimeout(() => {
				window.location.reload();
			}, 0);
		}).catch(err => {
			this.isSignInLoading = false;
			this.signInError = err;
		});
	}

	public registerWithLoginAndPassword() {
		this.isRegisterLoading = true;

		this.authenticationService.createUser(
			this.registerForm.controls.login.value,
			this.registerForm.controls.password.value
		).then(res => {
			this.isRegisterLoading = false;
			this.registerError = null;

			localStorage.setItem('currentUser', JSON.stringify(res));
			this.authenticationService.authenticate();
			this.router.navigate(['/']);
			setTimeout(() => {
				window.location.reload();
			}, 0);

		}).catch(err => {
			this.isRegisterLoading = false;
			this.registerError = err;
		});
	}

}
