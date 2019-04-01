import { each, find, flatten, groupBy, pick } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnackBarService } from '@app/home/services/snack-bar.service';
import { DataService } from '../home/services/data.service';
import { Player, PlayerResult } from '../home/home.model';
import { ROUNDS_ITERABLE } from '@app/variables';
import { Subscription, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap, first } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

@Component({
	selector: 'app-scores',
	templateUrl: './scores.component.html',
	styleUrls: ['./scores.component.scss']
})

export class ScoresComponent implements OnInit, OnDestroy {
	public teams$: Observable<Player[][]>;

	private chosenRoundSubject = new BehaviorSubject<number>(null);
	public chosenRound$: Observable<number> = this.chosenRoundSubject.asObservable();

	private isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

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

		this.dataService.options$.subscribe(options => this.chosenRoundSubject.next(options.currentRound));

		this.teams$ = this.chosenRound$.pipe(
			tap(() => this.isLoadingSubject.next(true)),
			switchMap(round => {
				return combineLatest(
					this.dataService.data$,
					this.dataService.getRoundScore(round)
				);
			}),
			map(([data, score]) => {
				const teams = Object.values(groupBy(data, 'team'));
				each(teams, (team) => {
					each(team, (player) => {
						const playerData = find(score, { name: player.name });
						player.score = playerData ? playerData.score : 0;
						player.bonus = playerData ? playerData.bonus : 0;
					});
				});

				return teams;
			}),
			tap(() => this.isLoadingSubject.next(false))
		);
	}

	public changeRound(event: MatSelectChange) {
		this.chosenRoundSubject.next(event.value);
	}

	public save(): void {
		const savedPlayers: PlayerResult[] = [];

		combineLatest(
			this.teams$,
			this.chosenRound$
		).pipe(first()).subscribe(([teams, chosenRound]) => {
			each(flatten(teams), (player) => {
				savedPlayers.push(pick(player, ['name', 'score', 'bonus']));
			});

			console.log(savedPlayers);
			this.dataService.saveResults(savedPlayers, chosenRound).then(() => {
				this.snackBarService.messageSuccess('Wyniki zapisane');
			});
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
