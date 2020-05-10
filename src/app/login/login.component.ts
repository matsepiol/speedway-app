import { Component, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication/authentication.service';

const emailList = [
	'matsepiol@interia.pl',
	'szymoneczek134@op.pl',
	'ligieza.lukasz@gmail.com',
	'orlikowskimichal@wp.pl',
	'zioma@o2.pl',
	'aleksandra_nalepa@op.pl',
	'oxloczekxo@o2.pl',
	'areksuwalski@gmail.com',
	'witek0709@poczta.onet.pl',
	'riccaldi@gmail.com',
	'smaciek1@op.pl',
	'tomaszpawelbedkowski@gmail.com',
	'niemiec.agnieszka@interia.pl',
	'odi0@onet.eu',
	'malgorzatanalepa@op.pl',
	'marek.k83@gmail.com'
];

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {

	error: string;
	isLoading = false;

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private cdr: ChangeDetectorRef
	) {
	}

	public signInWithFacebook() {
		this.isLoading = true;
		// const res = {
		// 	user: {
		// 		uid: '4h41P3l8XqYRW7YSBy3LA9pYGOt2'
		// 	}
		// };
		this.authenticationService.signInWithFacebook()
			.then(res => {
				if (emailList.indexOf(res.user.email) !== -1) {
					this.isLoading = false;
					this.error = null;
					localStorage.setItem('currentUser', JSON.stringify(res));
					this.authenticationService.authenticate();
					this.router.navigate(['/']);
					setTimeout(() => {
						window.location.reload();
					}, 0);
				} else {
					this.isLoading = false;
					this.error = 'Nie masz uprawnień, by się zalogować. Skontaktuj się z administratorem.';
					this.cdr.detectChanges();
				}
			})
			.catch((err) => {
				this.isLoading = false;
				console.log(err);
			});
	}

}
