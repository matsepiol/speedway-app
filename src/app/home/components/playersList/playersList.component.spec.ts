import { TestBed, ComponentFixture } from '@angular/core/testing';

import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { MatDialogModule, MatSnackBar } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationService } from '@app/authentication/authentication.service';

import { Store } from '@app/home/services/store.service';
import { MockDataService } from '@app/home/services/data.service.mock';

import { SnackBarService } from '@app/home/services/snack-bar.service';
import { FilterPipe } from '@app/shared/filterPipe/filterPipe';

import { environment } from '@env/environment';
import { ClipboardService } from 'ngx-clipboard';
import { PlayersListComponent } from './playersList.component';
import { PlayerType } from '@app/home/home.model';

const testUser = { 'user': { 'uid': '1234', 'displayName': 'test' } };

describe('PlayersListComponent', () => {
	let fixture: ComponentFixture<PlayersListComponent>;
	let component: PlayersListComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				AngularFireDatabaseModule,
				RouterTestingModule,
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
				{ provide: Store, useClass: MockDataService },
				{ provide: ClipboardService, useClass: class { public copyFromContent() {}  }},
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

	it('should initialize player list correctly', () => {
		component.ngOnInit();

		expect(component.availablePlayers.length).toEqual(2);
		expect(component.selectedPlayers.length).toEqual(0);
		expect(component.isLoading).toBeFalsy();
	});

	it('should select player correctly', () => {
		component.filter.searchQuery = '1234';
		expect(component.availablePlayers.length).toEqual(2);

		const player = {
			name: 'Zmarzlik',
			type: PlayerType.SENIOR
		};

		component.selectPlayer(player);
		expect(component.availablePlayers.length).toEqual(1);
		expect(component.filter.searchQuery).toEqual('');
	});

	it('should unselect player correctly', () => {
		const player = {
			name: 'Test',
			type: PlayerType.SENIOR
		};

		expect(component.availablePlayers.length).toEqual(2);
		component.unselectPlayer(player, 1);
		expect(component.availablePlayers.length).toEqual(3);
	});

	it('should reset filters', () => {
		component.filter = {
			team: ['test'],
			type: ['test'],
			sort: 'team',
			searchQuery: '1234',
			showPossiblePlayers: true,
			showMinimum: false
		};

		component.clearFilters();
		expect(component.filter.team).toEqual([]);
		expect(component.filter.type).toEqual([]);
		expect(component.filter.sort).toEqual('ksm');
		expect(component.filter.searchQuery).toEqual('');
		expect(component.filter.showPossiblePlayers).toEqual(false);
		expect(component.filter.showMinimum).toEqual(false);
	});

	it('should export squad correctly', () => {
		const ksmSpy = spyOn(component.dataService, 'getKsmValue');

		spyOn((component as any).snackBarService, 'messageSuccess').and.callThrough();
		spyOn((component as any).snackBarService, 'messageError').and.callThrough();
		spyOn((component as any).clipboardService, 'copyFromContent').and.callThrough();

		component.selectedPlayers = [
			{
				type: PlayerType.SENIOR,
				placeholder: true
			}
		];

		ksmSpy.and.returnValue(40);

		component.exportSquad();
		expect((component as any).snackBarService.messageError).toHaveBeenCalledWith('Skład nie jest kompletny!');

		component.selectedPlayers = [
			{
				type: PlayerType.SENIOR,
				placeholder: false
			}
		];

		ksmSpy.and.returnValue(50);
		component.exportSquad();
		expect((component as any).snackBarService.messageError).toHaveBeenCalledWith('Skład przekracza dopuszczalny ksm!');

		component.selectedPlayers = [
			{
				type: PlayerType.SENIOR,
				placeholder: false,
				name: 'Zmarzlik'
			},
			{
				type: PlayerType.JUNIOR,
				placeholder: false,
				name: 'Dudek'
			}
		];

		ksmSpy.and.returnValue(40);
		component.exportSquad();

		expect((component as any).clipboardService.copyFromContent).toHaveBeenCalledWith('1. Zmarzlik 2. Dudek Ksm: 40');
		expect((component as any).snackBarService.messageSuccess).toHaveBeenCalledWith('Skład skopiowany do schowka!');
	});
});
