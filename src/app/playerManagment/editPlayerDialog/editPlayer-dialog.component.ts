import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Player } from '@app/home/home.model';
import { cloneDeep } from 'lodash';

@Component({
	selector: 'app-edit-player-dialog',
	templateUrl: './editPlayer-dialog.component.html',
	styleUrls: ['./editPlayer-dialog.component.scss'],
})

export class EditPlayerDialogComponent {
	public playerData: Player;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: Player
	) {
		this.playerData = cloneDeep(data);
	}

}
