import { TestBed, ComponentFixture } from '@angular/core/testing';

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
import { of } from 'rxjs';

class MockDataService {
	public setSelection() {
		return;
	}

	public getData() {
		return of([{ name: 'Zmarzlik', type: 'senior' }]);
	}

	public getSelection() {
		return of([{ name: 'Zmarzlik', type: 'senior' }]);
	}

	public getRoundSquads() {
		return of(['Zmarzlik']);
	}

	public getKsmSum() {
		return of(10);
	}

	public getKsmLeft() {
		return of(40);
	}
}

describe('PlayersListComponent', () => {
	let fixture: ComponentFixture<PlayersListComponent>;
	let component: PlayersListComponent;
	const testUser = { 'user': { 'uid': '1234', 'displayName': 'test' }};

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
				{ provide: AngularFireAuth, useClass: class { } },
				{ provide: AuthenticationService, useClass: class { } },
				{ provide: DataService, useClass: MockDataService },
				SnackBarService,
				MatSnackBar
			],
			schemas: [
				NO_ERRORS_SCHEMA
			],
		}).compileComponents();
	});

	beforeEach(() => {
		spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify(testUser));

		fixture = TestBed.createComponent(PlayersListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

});

it('should create the app', () => {
	expect(component).toBeTruthy();
});

});
