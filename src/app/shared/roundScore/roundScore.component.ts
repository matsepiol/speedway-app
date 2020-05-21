import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Users } from '@app/users.model';
import { Squad } from '@app/scores/scores.model';

@Component({
	selector: 'app-round-score',
	templateUrl: './roundScore.component.html',
	styleUrls: ['./roundScore.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class RoundScoreComponent {
	public users = Users;
	@Input() public squads: Squad[];

	constructor() {}

}
