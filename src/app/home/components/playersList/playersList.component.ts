import { cloneDeep, countBy } from 'lodash';
import { ClipboardService } from 'ngx-clipboard';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { Filter, Player, teamPlaceholder } from '../../home.model';
import { DataService } from '../../services/data.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import {
	GenericConfirmationDialogComponent
} from '@app/shared/genericConfirmationDialog/generic-confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
@Component({
	selector: 'app-players-list',
	templateUrl: './playersList.component.html',
	styleUrls: ['./playersList.component.scss']
})

export class PlayersListComponent implements OnInit, OnDestroy {

	public availablePlayers: Player[];
	public isLoading: boolean;
	public isUserSquadSent = false;
	public loadingMessage = 'Wczytywanie...';
	public teamFilters: string[] = [];
	public typeFilters: string[] = [];
	public filter: Filter = {
		team: [], type: [], sort: 'ksm', searchQuery: '', showPossiblePlayers: false, showMinimum: false
	};
	public selectedPlayers: Player[] = [];
	public currentRound: number;

	private confirmationDialog: MatDialogRef<GenericConfirmationDialogComponent>;
	private playersSubscribtion: Subscription;
	private selectionSubscribtion: Subscription;
	private roundSquadsSubscribtion: Subscription;

	constructor(
		public authenticationService: AuthenticationService,
		public clipboardService: ClipboardService,
		public dataService: DataService,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private snackBarService: SnackBarService,
	) { }

	public ngOnInit(): void {
		this.dataService.getOptions().subscribe(options => {
			this.currentRound = options.currentRound;
			this.init();
		});
	}

	public init(): void {
		this.isLoading = true;
		const initialSelection = JSON.parse(localStorage.getItem('teamSelection')) || cloneDeep(teamPlaceholder);
		this.dataService.setSelection(initialSelection, this.currentRound);
		this.playersSubscribtion = this.dataService.getData().subscribe((data) => {
			this.isLoading = false;
			this.availablePlayers = data.filter(
				players => this.selectedPlayers.every(selection => selection.name !== players.name)
			);

			this.prepareFiltering();
		});

		this.selectionSubscribtion = this.dataService.getSelection().subscribe((selected) => {
			this.selectedPlayers = selected;
			this.saveSelectionToLocalStorage(selected);
		});

		this.roundSquadsSubscribtion = this.dataService.getRoundSquads(
			this.currentRound,
			JSON.parse(localStorage.getItem('currentUser')).user.uid
		).subscribe((team) => {
			this.isUserSquadSent = !!team.length;
		});
	}

	public selectPlayer(player: Player): void {
		const selectionSuccess = this.dataService.selectPlayer(player, this.currentRound);
		if (selectionSuccess) {
			this.availablePlayers = this.availablePlayers.filter((p) => p.name !== player.name);
		}
		this.filter.searchQuery = '';
	}

	public unselectPlayer(player: Player, index: number): void {
		this.availablePlayers.push(player);
		this.dataService.unselectPlayer(player, index, this.currentRound);
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
		if ((countBy(this.selectedPlayers, 'placeholder').true)) {
			this.snackBarService.messageError('Skład nie jest kompletny!');
		} else if (this.dataService.getKsmValue() > 45) {
			this.snackBarService.messageError('Skład przekracza dopuszczalny ksm!');
		} else {
			let textToCopy = '';
			this.selectedPlayers.forEach((selected, index) => {
				textToCopy += `${index + 1}. ${selected.name} `;
			});
			textToCopy += `Ksm: ${this.dataService.getKsmValue()}`;
			this.clipboardService.copyFromContent(textToCopy);
			this.snackBarService.messageSuccess('Skład skopiowany do schowka!');
		}
	}

	public sendSquad(): void {
		const playersToSend = this.selectedPlayers.map((player) => {
			return player['name'];
		});

		this.confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz wysłać ten skład?',
					dialogText: 'Po wysłaniu składu nie da się już go zmienić. Czy na pewno chcesz kontunuować?',
					confirmText: 'Wysyłam!'
				}
			});

		this.confirmationDialog.afterClosed().pipe(
			first()
		).subscribe(result => {
			if (result) {
				this.dataService.sendSquad(playersToSend, this.currentRound).then(() => {
					this.snackBarService.messageSuccess('Wyniki wysłane!');
					this.clearSquad();
				});
			}
		});
	}

	public clearSquad(): void {
		this.dataService.setSelection(cloneDeep(teamPlaceholder), this.currentRound);
		this.init();
	}

	private saveSelectionToLocalStorage(selection: Player[]) {
		localStorage.setItem('teamSelection', JSON.stringify(selection));
	}

	private prepareFiltering(): void {
		this.teamFilters = this.availablePlayers.map(item => item.team)
			.filter((value, index, self) => self.indexOf(value) === index);

		this.typeFilters = this.availablePlayers.map(item => item.type)
			.filter((value, index, self) => self.indexOf(value) === index);
	}

	public disableSendSquadButton(): boolean {
		return !!(countBy(this.selectedPlayers, 'placeholder').true)
			|| this.dataService.getKsmValue() > 45
			|| new Date() > new Date(2019, 4, 5, 17, 0, 0);
	}

	public ngOnDestroy(): void {
		if (this.playersSubscribtion) {
			this.playersSubscribtion.unsubscribe();
		}
		if (this.selectionSubscribtion) {
			this.selectionSubscribtion.unsubscribe();
		}
		if (this.roundSquadsSubscribtion) {
			this.roundSquadsSubscribtion.unsubscribe();
		}
	}

}
