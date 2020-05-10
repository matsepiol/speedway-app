import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { isUndefined } from 'lodash';

import { Player, Filter } from '@app/home/home.model';
import { Store } from '@app/home/services/store.service';
import { SnackBarService } from '@app/home/services/snack-bar.service';
import { EditPlayerDialogComponent } from './editPlayerDialog/editPlayer-dialog.component';
import {
	GenericConfirmationDialogComponent
} from '@app/shared/genericConfirmationDialog/generic-confirmation-dialog.component';
import { ROUNDS_ITERABLE } from '@app/variables';

import { Options, Game } from './playerManagement.model';

const games: Game[] = [
	{
		home: '',
		away: ''
	},
	{
		home: '',
		away: ''
	},
	{
		home: '',
		away: ''
	},
	{
		home: '',
		away: ''
	}
];

@Component({
	selector: 'app-player-management',
	templateUrl: './playerManagement.component.html',
	styleUrls: ['./playerManagement.component.scss']
})

export class PlayerManagementComponent implements OnInit {
	public teamFilters: string[] = [];
	public typeFilters: string[] = [];
	public loadingMessage = 'Wczytywanie...';

	public date: Date;
	public roundsIterable = ROUNDS_ITERABLE;
	public filter: Filter = {
		team: [], type: [], sort: 'team', searchQuery: ''
	};
	private _editPlayerDialog: MatDialogRef<EditPlayerDialogComponent>;
	private _confirmationDialog: MatDialogRef<GenericConfirmationDialogComponent>;

	private _tempPlayersSubject = new BehaviorSubject<Player[]>([]);
	public tempPlayers$: Observable<Player[]> = this._tempPlayersSubject.asObservable();

	private _tempOptionsSubject = new BehaviorSubject<Options>({ currentRound: null, date: null, games });
	public tempOptions$: Observable<Options> = this._tempOptionsSubject.asObservable();

	private _isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this._isLoadingSubject.asObservable();

	public copyKsm: any = {
		from: null,
		to: null
	};

	constructor(
		public dialog: MatDialog,
		public store: Store,
		private snackBarService: SnackBarService,
	) { }

	public ngOnInit(): void {
		this.store.data$.pipe(
			first(players => !!players.length)
		).subscribe(players => {
			this._tempPlayersSubject.next(players);
			this._isLoadingSubject.next(false);
		});

		this.prepareFiltering();
	}

	public addPlayer(): void {
		this._editPlayerDialog = this.dialog.open(EditPlayerDialogComponent, { width: '400px', data: { ksm: [] } });

		this._editPlayerDialog.afterClosed().pipe(
			first(result => !!result)
		).subscribe((result: any) => {
			this._tempPlayersSubject.next([...this._tempPlayersSubject.getValue(), result]);
		});
	}

	public editPlayer(player: Player): void {
		this._editPlayerDialog = this.dialog.open(EditPlayerDialogComponent, { width: '400px', data: player });
		this._editPlayerDialog.afterClosed().pipe(
			first(result => !!result)
		).subscribe((result: any) => {
			result.ksm.forEach((ksmValue: number, index: number) => {
				if (isUndefined(ksmValue)) {
					result.ksm[index] = null;
				}
			});

			Object.assign(player, result);
		});
	}

	public removePlayer(removedPlayer: Player): void {
		this._confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz usunąć tego zawodnika?',
					confirmText: 'Usuń'
				}
			});

		this._confirmationDialog.afterClosed().pipe(
			first(result => !!result)
		).subscribe(() => {
			this._tempPlayersSubject.next(this._tempPlayersSubject.getValue().filter(player => player !== removedPlayer));
		});
	}

	public saveChanges(): void {
		this._confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz zapisać zmiany zawodników?',
					confirmText: 'Zapisz'
				}
			});

		this._confirmationDialog.afterClosed().pipe(
			first(result => !!result)
		).subscribe(() => {
			this.store.changePlayersData(this._tempPlayersSubject.getValue()).then(() => {
				this.snackBarService.messageSuccess('Zmiany zawodników zapisane');
			});
		});
	}

	private prepareFiltering(): void {
		this.tempPlayers$.subscribe(players => {
			this.teamFilters = players.map(item => item.team).filter((value, index, self) => self.indexOf(value) === index);
			this.typeFilters = players.map(item => item.type).filter((value, index, self) => self.indexOf(value) === index);
		});
	}

	public copyRoundKsm() {
		if (
			!this.copyKsm.from ||
			!this.copyKsm.to ||
			this.copyKsm.from > 14 ||
			this.copyKsm.to > 14 ||
			this.copyKsm.from < 1 ||
			this.copyKsm.to < 1 ||
			this.copyKsm.from === this.copyKsm.to
		) {
			this.snackBarService.messageError('Niepoprawne dane do kopiowania');
			return;
		}

		this._confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz skopiować ten ksm?',
					confirmText: 'Zapisz'
				}
			});

		this._confirmationDialog.afterClosed().subscribe(result => {
			if (result) {
				const players = this._tempPlayersSubject.getValue();
				players.forEach(player => {
					player.ksm[this.copyKsm.to - 1] = player.ksm[this.copyKsm.from - 1];
				});

				this._tempPlayersSubject.next(players);
			}
		});
	}

	public onSelect(event: MatTabChangeEvent): void {
		if (event.tab.textLabel === 'Kolejka') {
			this.store.options$.subscribe(options => {
				this._tempOptionsSubject.next(options);
				this.date = new Date(options.date);
			});
		}
	}

	public changeCurrentRound(val: number): void {
		const options = this._tempOptionsSubject.getValue();
		options.currentRound = val;

		this._tempOptionsSubject.next(options);
	}

	public changeGame(val: string, index: number, type: string): void {
		const options = this._tempOptionsSubject.getValue();
		options.games[index][type] = val;

		this._tempOptionsSubject.next(options);
	}

	public saveOptions(): void {
		this._confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz zapisać opcje kolejki?',
					confirmText: 'Zapisz'
				}
			});

		this._confirmationDialog.afterClosed().pipe(
			first(result => !!result)
		).subscribe(() => {
			const options = this._tempOptionsSubject.getValue();
			options.date = this.date.toISOString();

			this.store.saveOptions(options).then(() => {
				this.snackBarService.messageSuccess('Opcje kolejki zapisane');
			});
		});
	}
}
