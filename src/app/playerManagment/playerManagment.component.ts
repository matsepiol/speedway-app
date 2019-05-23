import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '@app/home/services/data.service';
import { Player, Filter } from '@app/home/home.model';
import { EditPlayerDialogComponent } from './editPlayerDialog/editPlayer-dialog.component';
import { MatDialogRef, MatDialog, MatTabChangeEvent } from '@angular/material';
import {
	GenericConfirmationDialogComponent
} from '@app/shared/genericConfirmationDialog/generic-confirmation-dialog.component';
import { SnackBarService } from '@app/home/services/snack-bar.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { isUndefined, isNumber } from 'lodash';
import { ROUNDS_ITERABLE } from '@app/variables';
import { Options, Game } from './playerManagment.model';

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
	selector: 'app-player-managment',
	templateUrl: './playerManagment.component.html',
	styleUrls: ['./playerManagment.component.scss']
})


export class PlayerManagmentComponent implements OnInit, OnDestroy {
	public isLoading: boolean;
	public players: Player[];
	public teamFilters: string[] = [];
	public typeFilters: string[] = [];
	public loadingMessage = 'Wczytywanie...';
	public selectedRound: number;
	public options: Options = {
		currentRound: null,
		date: null,
		games
	};
	public date: Date;
	public roundsIterable = ROUNDS_ITERABLE;
	public filter: Filter = {
		team: [], type: [], sort: 'team', searchQuery: '', showSzrot: true
	};
	private editPlayerDialog: MatDialogRef<EditPlayerDialogComponent>;
	private confirmationDialog: MatDialogRef<GenericConfirmationDialogComponent>;
	private dataSubscribtion: Subscription;

	constructor(
		public dialog: MatDialog,
		public dataService: DataService,
		private snackBarService: SnackBarService,
	) { }

	ngOnInit(): void {
		this.dataSubscribtion = this.dataService.getData().subscribe((data: Player[]) => {
			this.isLoading = false;
			this.players = data;
			this.prepareFiltering();
		});
	}

	public addPlayer(): void {
		this.editPlayerDialog = this.dialog.open(EditPlayerDialogComponent, { width: '400px', data: { ksm: []} });
		this.editPlayerDialog.afterClosed().pipe(
			first()
		).subscribe(result => {
			if (result) {
				this.players.push(result);
			}
		});
	}

	public editPlayer(player: Player): void {
		if (isNumber(player.ksm)) {
			player.ksm = [player.ksm];
		}
		this.editPlayerDialog = this.dialog.open(EditPlayerDialogComponent, { width: '400px', data: player });
		this.editPlayerDialog.afterClosed().pipe(
			first()
		).subscribe(result => {
			if (result) {
				result.ksm.forEach((ksmValue: number, index: number) => {
					if (isUndefined(ksmValue)) {
						result.ksm[index] = null;
					}
				});

				Object.assign(player, result);
			}
		});
	}

	public removePlayer(removedPlayer: Player): void {
		this.confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz usunąć tego zawodnika?',
					confirmText: 'Usuń'
				}
			});

		this.confirmationDialog.afterClosed().pipe(
			first()
		).subscribe(result => {
			if (result) {
				this.players = this.players.filter(player => player !== removedPlayer);
			}
		});
	}

	public saveChanges(): void {
		this.confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz zapisać zmiany zawodników?',
					confirmText: 'Zapisz'
				}
			});

		this.confirmationDialog.afterClosed().subscribe(result => {
			if (result) {
				this.dataService.changePlayersData(this.players).then(() => {
					this.snackBarService.messageSuccess('Zmiany zawodników zapisane');
				});
			}
		});
	}

	private prepareFiltering(): void {
		this.teamFilters = this.players.map(item => item.team)
			.filter((value, index, self) => self.indexOf(value) === index);

		this.typeFilters = this.players.map(item => item.type)
			.filter((value, index, self) => self.indexOf(value) === index);
	}

	public onSelect(event: MatTabChangeEvent) {
		if (event.tab.textLabel === 'Kolejka') {
			this.dataService.getOptions().subscribe(options => {
				this.options = options;
				this.date = new Date(options.date);
			});
		}
	}

	public saveOptions() {
		this.confirmationDialog = this.dialog.open(GenericConfirmationDialogComponent,
			{
				width: '400px',
				data: {
					title: 'Czy na pewno chcesz zapisać opcje kolejki?',
					confirmText: 'Zapisz'
				}
			});

		this.confirmationDialog.afterClosed().subscribe(result => {
			if (result) {
				this.options.date = this.date.toISOString();
				this.dataService.saveOptions(this.options).then(() => {
					this.snackBarService.messageSuccess('Opcje kolejki zapisane');
				});
			}
		});
	}

	public ngOnDestroy(): void {
		if (this.dataSubscribtion) {
			this.dataSubscribtion.unsubscribe();
		}
	}
}
