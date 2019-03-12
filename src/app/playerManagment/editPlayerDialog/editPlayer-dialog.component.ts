import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Player } from '@app/home/home.model';
import { cloneDeep } from 'lodash';
import { CURRENT_ROUND, ROUNDS_ITERABLE } from '@app/variables';

@Component({
	selector: 'app-edit-player-dialog',
	templateUrl: './editPlayer-dialog.component.html',
	styleUrls: ['./editPlayer-dialog.component.scss'],
})

export class EditPlayerDialogComponent {
	public playerData: Player;
	public selectedRound: number = CURRENT_ROUND;
	public roundsIterable = ROUNDS_ITERABLE;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: Player
	) {
		this.playerData = cloneDeep(data);
	}

}
