import { each, find, flatten, groupBy, pick } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnackBarService } from '@app/home/services/snack-bar.service';
import { DataService } from '../home/services/data.service';
import { Player, PlayerResult } from '../home/home.model';
import { CURRENT_ROUND, ROUNDS_ITERABLE } from '@app/variables';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-scores',
	templateUrl: './scores.component.html',
	styleUrls: ['./scores.component.scss']
})

export class ScoresComponent implements OnInit, OnDestroy {
	public teams: Player[][];
	public isLoading: boolean;
	public currentRound = CURRENT_ROUND;
	public roundsIterable = ROUNDS_ITERABLE;
	public loadingMessage = 'Wczytywanie...';
	private dataSubscribtion: Subscription;
	private roundScoreSubscribtion: Subscription;

	constructor(
		public dataService: DataService,
		private snackBarService: SnackBarService,
	) {
	}

	public ngOnInit(): void {
		this.dataSubscribtion = this.dataService.getData().subscribe((data: Player[]) => {
			this.teams = Object.values(groupBy(data, 'team'));
			this.fetchRoundScore();
		});
	}

	public onRoundChange(): void {
		this.fetchRoundScore();
	}

	private fetchRoundScore(): void {
		this.isLoading = true;

		this.roundScoreSubscribtion = this.dataService.getRoundScore(this.currentRound).subscribe((data: PlayerResult[]) => {
			each(this.teams, (team) => {
				each(team, (player) => {
					const playerData = find(data, { name: player.name });
					player.score = playerData ? playerData.score : 0;
					player.bonus = playerData ? playerData.bonus : 0;
				});
			});
			this.isLoading = false;
		});
	}

	public save(): void {
		const savedPlayers: PlayerResult[] = [];
		each(flatten(this.teams), (player) => {
			savedPlayers.push(pick(player, ['name', 'score', 'bonus']));
		});

		this.dataService.saveResults(savedPlayers, this.currentRound).then(() => {
			this.snackBarService.messageSuccess('Wyniki zapisane');
		});
	}

	public ngOnDestroy(): void {
		if (this.dataSubscribtion) {
			this.dataSubscribtion.unsubscribe();
		}

		if (this.roundScoreSubscribtion) {
			this.roundScoreSubscribtion.unsubscribe();
		}
	}
}
