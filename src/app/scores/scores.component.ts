import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap, first } from 'rxjs/operators';

import { each, find, groupBy, pick, Dictionary } from 'lodash';

import { SnackBarService } from '@app/home/services/snack-bar.service';
import { ROUNDS_ITERABLE } from '@app/variables';
import { Store } from '../home/services/store.service';
import { Player, PlayerResult } from '../home/home.model';

@Component({
	selector: 'app-scores',
	templateUrl: './scores.component.html',
	styleUrls: ['./scores.component.scss']
})

export class ScoresComponent implements OnInit {
	public teams$: Observable<Dictionary<Player[]>>;

	private _chosenRoundSubject = new BehaviorSubject<number>(null);
	public chosenRound$: Observable<number> = this._chosenRoundSubject.asObservable();

	private _isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this._isLoadingSubject.asObservable();

	public roundsIterable = ROUNDS_ITERABLE;
	public loadingMessage = 'Wczytywanie...';

	private _tempScore: Dictionary<Player[]>;

	constructor(
		public store: Store,
		private _snackBarService: SnackBarService,
	) {
	}

	public ngOnInit(): void {
		this.store.options$.pipe(
			first(options => !!options.currentRound)
		).subscribe(options => this._chosenRoundSubject.next(options.currentRound));

		this.teams$ = this.chosenRound$.pipe(
			tap(() => this._isLoadingSubject.next(true)),
			switchMap(round => {
				return combineLatest(
					this.store.data$,
					this.store.getRoundScore(round)
				);
			}),
			map(([data, score]) => {
				const teams = groupBy(data, 'team');
				each(teams, (team) => {
					each(team, (player) => {
						const playerData = find(score, { name: player.name });
						player.score = playerData ? playerData.score : 0;
						player.bonus = playerData ? playerData.bonus : 0;
					});
				});

				return teams;
			}),
			tap(teams => this._tempScore = teams),
			tap(() => this._isLoadingSubject.next(false)),
		);
	}

	public changeRound(event: MatSelectChange): void {
		this._chosenRoundSubject.next(event.value);
	}

	public onScoreChange(player: Player, value: string, type: string): void {
		this._tempScore[player.team].find(p => p.name === player.name)[type] = parseInt(value, 10);
	}

	public save(): void {
		const savedPlayers: PlayerResult[] = [];
		const chosenRound = this._chosenRoundSubject.getValue();

		each(this._tempScore, (team) => {
			each(team, player => {
				savedPlayers.push(pick(player, ['name', 'score', 'bonus']));
			});
		});

		this.store.saveResults(savedPlayers, chosenRound).then(() => {
			this._snackBarService.messageSuccess('Wyniki zapisane');
		});
	}
}
