import { each, find, groupBy, pick, Dictionary } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnackBarService } from '@app/home/services/snack-bar.service';
import { Store } from '../home/services/store.service';
import { Player, PlayerResult } from '../home/home.model';
import { ROUNDS_ITERABLE } from '@app/variables';
import { Observable, combineLatest, BehaviorSubject, Subscription } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

@Component({
	selector: 'app-scores',
	templateUrl: './scores.component.html',
	styleUrls: ['./scores.component.scss']
})

export class ScoresComponent implements OnInit, OnDestroy {
	public teams$: Observable<Dictionary<Player[]>>;

	private chosenRoundSubject = new BehaviorSubject<number>(null);
	public chosenRound$: Observable<number> = this.chosenRoundSubject.asObservable();

	private isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

	public roundsIterable = ROUNDS_ITERABLE;
	public loadingMessage = 'Wczytywanie...';

	private roundSubscription: Subscription;
	private tempScore: Dictionary<Player[]>;

	constructor(
		public store: Store,
		private snackBarService: SnackBarService,
	) {
	}

	public ngOnInit(): void {
		this.roundSubscription = this.store.options$.subscribe(options => this.chosenRoundSubject.next(options.currentRound));

		this.teams$ = this.chosenRound$.pipe(
			tap(() => this.isLoadingSubject.next(true)),
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
			tap(teams => this.tempScore = teams),
			tap(() => this.isLoadingSubject.next(false)),
		);
	}

	public changeRound(event: MatSelectChange): void {
		this.chosenRoundSubject.next(event.value);
	}

	public onScoreChange(player: Player, value: string, type: string): void {
		this.tempScore[player.team].find(p => p.name === player.name)[type] = parseInt(value, 10);
	}

	public save(): void {
		const savedPlayers: PlayerResult[] = [];
		const chosenRound = this.chosenRoundSubject.getValue();

		each(this.tempScore, (team) => {
			each(team, player => {
				savedPlayers.push(pick(player, ['name', 'score', 'bonus']));
			});
		});

		this.store.saveResults(savedPlayers, chosenRound).then(() => {
			this.snackBarService.messageSuccess('Wyniki zapisane');
		});
	}

	public ngOnDestroy() {
		if (this.roundSubscription) {
			this.roundSubscription.unsubscribe();
		}
	}
}
