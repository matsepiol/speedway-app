import { TestBed } from '@angular/core/testing';

import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { MatDialogModule, MatSnackBar } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationService } from '@app/authentication/authentication.service';
import { DataService } from '@app/home/services/data.service';
import { SnackBarService } from '@app/home/services/snack-bar.service';
import { FilterPipe } from '@app/shared/filterPipe/filterPipe';

import { environment } from '@env/environment';
import { ClipboardModule } from 'ngx-clipboard';
import { PlayersListComponent } from './playersList.component';


describe('PlayersListComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				AngularFireDatabaseModule,
				RouterTestingModule,
				ClipboardModule,
				OverlayModule,
				MatDialogModule
			],
			declarations: [
				PlayersListComponent,
				FilterPipe
			],
			providers: [
				{ provide: AngularFireAuth, useClass: class {} },
				{ provide: AuthenticationService, useClass: class {} },
				{ provide: DataService, useClass: class {} },
				SnackBarService,
				MatSnackBar
			],
			schemas: [
				NO_ERRORS_SCHEMA
			],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(PlayersListComponent);
		const app = fixture.debugElement.componentInstance;

		console.log(app);
		expect(app).toBeTruthy();
	});
});
