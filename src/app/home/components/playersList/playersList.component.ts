import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable, combineLatest } from 'rxjs';
import { first, tap, map, filter } from 'rxjs/operators';

import { cloneDeep, countBy } from 'lodash';
import { ClipboardService } from 'ngx-clipboard';

import { AuthenticationService } from '@app/authentication/authentication.service';
import { Filter, Player, teamPlaceholder } from '../../home.model';
import { Store } from '../../services/store.service';
import { SnackBarService } from '../../services/snack-bar.service';
import {
	GenericConfirmationDialogComponent
} from '@app/shared/genericConfirmationDialog/generic-confirmation-dialog.component';

@Component({
	selector: 'app-players-list',
	templateUrl: './playersList.component.html',
	styleUrls: ['./playersList.component.scss']
})

export class PlayersListComponent implements OnInit {
	public date: Date;
	public loadingMessage = 'Wczytywanie...';
	public teamFilters: string[] = [];
	public typeFilters: string[] = [];
	public filter: Filter = {
		team: [], type: [], sort: 'ksm', searchQuery: '', showPossiblePlayers: false, showMinimum: false, showSzrot: false
	};

	public players$: Observable<Player[]>;
	public selectedPlayers$: Observable<Player[]>;
	public availablePlayers$: Observable<Player[]>;
	public currentRound$: Observable<number>;
	public isUserSquadSent$: Observable<boolean>;

	private _confirmationDialog: MatDialogRef<GenericConfirmationDialogComponent>;

	constructor(
		public authenticationService: AuthenticationService,
		public clipboardService: ClipboardService,
		public dialog: MatDialog,
		public store: Store,
		private _snackBarService: SnackBarService,
	) { }

	public ngOnInit(): void {
		// const initialSelection = JSON.parse(localStorage.getItem('teamSelection')) || cloneDeep(teamPlaceholder);
		// this.store.setSelection(initialSelection);

		this.players$ = this.store.data$;

		this.selectedPlayers$ = this.store.selectedPlayers$.pipe(
			filter(selected => !!selected.length),
			tap(selected => this.store.saveSelectionToLocalStorage(selected))
		);

		this.availablePlayers$ = combineLatest(
			this.players$,
			this.selectedPlayers$
		).pipe(
			map(([players, selected]) => players.filter(
				player => selected.every(selection => selection.name !== player.name)
			)),
		);

		this.isUserSquadSent$ = this.store.currentSquad$.pipe(
			map(team => !!team.length),
		);

		this.currentRound$ = this.store.options$.pipe(
			map(options => options.currentRound),
			tap(() => this.store.getCurrentRoundSquad())
		);

		this.store.calculateKsmSum();
		this.prepareFiltering();
	}

	public selectPlayer(player: Player): void {
		this.store.selectPlayer(player);
		this.filter.searchQuery = '';
	}

	public unselectPlayer(player: Player, index: number): void {
		this.store.unselectPlayer(player, index);
	}

	public clearFilters(): void {
		this.filter = {
			team: [],
			type: [],
			sort: 'ksm',
			searchQuery: '',
			showPossiblePlayers: false,
			showMinimum: this.filter.showMinimum
		};
	}

	public exportSquad(): void {
		const selectedPlayers = this.store.getSelectedPlayersValue();
		if ((countBy(selectedPlayers, 'placeholder').true)) {
			this._snackBarService.messageError('Skład nie jest kompletny!');
		} else if (this.store.getKsmValue() > 45) {
			this._snackBarService.messageError('Skład przekracza dopuszczalny ksm!');
		} else {
			let textToCopy = '';
			selectedPlayers.forEach((selected, index) => {
				textToCopy += `${index + 1}. ${selected.name} `;
			});

			textToCopy += `Ksm: ${this.store.getKsmValue()}`;

			this.clipboardService.copyFromContent(textToCopy);
			this._snackBarService.messageSuccess('Skład skopiowany do schowka!');
		}
	}

	public sendSquad(): void {
		const playersToSend = this.store.getSelectedPlayersValue().map((player) => {
			return player['name'];
		});

		this._confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz wysłać ten skład?',
					dialogText: 'Po wysłaniu składu nie da się już go zmienić. Czy na pewno chcesz kontunuować?',
					confirmText: 'Wysyłam!'
				}
			});

		this._confirmationDialog.afterClosed().pipe(
			first(result => !!result)
		).subscribe(() => {
			this.store.sendSquad(playersToSend, this.store.getCurrentRound()).then(() => {
				this._snackBarService.messageSuccess('Wyniki wysłane!');
				this.clearSquad();
			});
		});
	}

	public clearSquad(): void {
		this.store.setSelection(cloneDeep(teamPlaceholder));
	}

	private prepareFiltering(): void {
		this.players$.pipe(
			first(players => !!players.length)
		).subscribe(players => {
			this.teamFilters = players.map(item => item.team).filter((value, index, self) => self.indexOf(value) === index);
			this.typeFilters = players.map(item => item.type).filter((value, index, self) => self.indexOf(value) === index);
		});
	}

	public disableSendSquadButton(): boolean {
		return !!(countBy(this.store.getSelectedPlayersValue(), 'placeholder').true)
			|| this.store.getKsmValue() > 45
			|| new Date() > this.date;
	}

}
