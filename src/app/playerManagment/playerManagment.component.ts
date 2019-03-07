import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/home/services/data.service';
import { Player, Filter } from '@app/home/home.model';
import { EditPlayerDialogComponent } from './editPlayerDialog/editPlayer-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import {
	GenericConfirmationDialogComponent
} from '@app/shared/genericConfirmationDialog/generic-confirmation-dialog.component';
import { SnackBarService } from '@app/home/services/snack-bar.service';

@Component({
	selector: 'app-player-managment',
	templateUrl: './playerManagment.component.html',
	styleUrls: ['./playerManagment.component.scss']
})

export class PlayerManagmentComponent implements OnInit {
	public isLoading: boolean;
	public players: Player[];
	public teamFilters: string[] = [];
	public typeFilters: string[] = [];
	public loadingMessage = 'Wczytywanie...';
	public filter: Filter = {
		team: [], type: [], sort: 'ksm', searchQuery: ''
	};
	private editPlayerDialog: MatDialogRef<EditPlayerDialogComponent>;
	private confirmationDialog: MatDialogRef<GenericConfirmationDialogComponent>;

	constructor(
		public dialog: MatDialog,
		public dataService: DataService,
		private snackBarService: SnackBarService,
	) { }

	ngOnInit() {
		this.dataService.getData().subscribe((data: Player[]) => {
			this.isLoading = false;
			this.players = data;
			this.prepareFiltering();
		});
	}

	public addPlayer(): void {
		this.editPlayerDialog = this.dialog.open(EditPlayerDialogComponent, { width: '400px', data: {} });
		this.editPlayerDialog.afterClosed().subscribe(result => {
			if (result) {
				this.players.push(result);
			}
		});
	}

	public editPlayer(player: Player): void {
		this.editPlayerDialog = this.dialog.open(EditPlayerDialogComponent, { width: '400px', data: player });
		this.editPlayerDialog.afterClosed().subscribe(result => {
			Object.assign(player, result);
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

		this.confirmationDialog.afterClosed().subscribe(result => {
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
					title: 'Czy na pewno chcesz zapisać zmiany?',
					confirmText: 'Zapisz'
				}
			});

		this.confirmationDialog.afterClosed().subscribe(result => {
			if (result) {
				this.dataService.changePlayersData(this.players).then(() => {
					this.snackBarService.messageSuccess('Zmiany zapisane');
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
}
