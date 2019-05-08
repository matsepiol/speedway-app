import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '../home/services/store.service';
import { Users } from '@app/users.model';
import { find, orderBy, remove } from 'lodash';
import { MatTableDataSource, MatTabChangeEvent, MatSelectChange } from '@angular/material';
import { Squad, StatsData } from './result.model';
import { Player, PlayerResult } from '../home/home.model';
import { TableData } from '@app/scores/scores.model';
import { combineLatest, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { ROUNDS_ITERABLE } from '@app/variables';
import { map } from 'rxjs/internal/operators/map';
import { tap, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit, OnDestroy {
	public loadingMessage = 'Wczytywanie...';
	public roundsIterable = ROUNDS_ITERABLE;
	public users = Users;
	public displayedStatsColumns: string[] = ['position', 'name', 'score', 'ksm', 'ratio'];

	private chosenRoundSubject = new BehaviorSubject<number>(null);
	public chosenRound$: Observable<number> = this.chosenRoundSubject.asObservable();

	private isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

	public isUserSquadSent$: Observable<boolean>;
	public squads$: Observable<Squad[]>;
	public tableData$: Observable<MatTableDataSource<TableData>>;
	public statsData$: Observable<MatTableDataSource<StatsData>>;

	private roundSubscription: Subscription;

	constructor(
		public store: Store,
	) {
	}

	public ngOnInit(): void {
		this.roundSubscription = this.store.options$.subscribe(options => this.chosenRoundSubject.next(options.currentRound));

		this.isUserSquadSent$ = this.chosenRound$.pipe(
			switchMap(round => {
				return this.store.getRoundSquadsById(
					round,
					JSON.parse(localStorage.getItem('currentUser')).user.uid
				);
			}),
			map(team => !!team.length),
		);

		this.squads$ = this.chosenRound$.pipe(
			tap(() => this.isLoadingSubject.next(true)),
			switchMap(round => {
				return combineLatest(
					this.store.getRoundSquads(round),
					this.store.getRoundScore(round),
					this.chosenRound$
				);
			}),
			map(([squads, scores, round]) => {
				const playersResult: Squad[] = [];
				squads.forEach(s => {
					playersResult.push({ userId: s.key, team: s.value, results: [] });
				});

				playersResult.forEach(playerResult => {
					playerResult.results = [];
					playerResult.scoreSum = 0;
					playerResult.bonusSum = 0;
					playerResult.team.forEach((player: string) => {
						let playerScore: PlayerResult = find(scores, { 'name': player });

						if (!playerScore) {
							playerScore = {
								name: player,
								score: 0,
								bonus: 0
							};
						}
						playerResult.scoreSum += playerScore ? playerScore.score : 0;
						playerResult.bonusSum += playerScore ? playerScore.bonus : 0;
						playerResult.results.push(playerScore);
					});

					if (playerResult.scoreSum) {
						this.store.setRoundResult(
							playerResult.userId,
							round,
							[playerResult.scoreSum, playerResult.bonusSum]
						);
					}
				});

				return playersResult;
			}),
			tap(() => this.isLoadingSubject.next(false)),

		);
	}

	public changeRound(event: MatSelectChange): void {
		this.chosenRoundSubject.next(event.value);
	}

	public fetchStatsData(): void {
		this.statsData$ = this.chosenRound$.pipe(
			switchMap(round => {
				return combineLatest(
					this.store.data$,
					this.store.getRoundScore(round),
					this.chosenRound$
				);
			}),
			tap(() => this.isLoadingSubject.next(true)),
			map(([players, scores, round]) => {

				let statsData: StatsData[] = [];
				if (scores.length) {
					players.forEach((player) => {
						const playerScore = find(scores, { 'name': player.name });
						if (playerScore) {
							player.score = playerScore.score;
							player.ratio = parseFloat((player.score / player.ksm[round - 1]).toFixed(2));
							statsData.push(player);
						}
					});
				}

				statsData = orderBy(statsData, ['ratio'], ['desc']).filter(player => player.score);
				return new MatTableDataSource(statsData);
			}),
			tap(() => this.isLoadingSubject.next(false)),
		);
	}

	private fetchTableData() {
		this.tableData$ = this.store.getRoundResult().pipe(
			tap(() => this.isLoadingSubject.next(true)),
			map(results => {
				const dataTable: TableData[] = [];

				results.forEach(result => {
					dataTable.push({
						userName: this.users[result.key],
						scoreSum: result.value.reduce((a: number, b) => a + parseInt(b[0], 10), 0),
						bonusSum: result.value.reduce((a: number, b) => a + parseInt(b[1], 10), 0),
					});
				});

				return new MatTableDataSource(dataTable);
			}),
			tap(() => this.isLoadingSubject.next(false)),
		);
	}

	public onSelect(event: MatTabChangeEvent): void {
		if (event.tab.textLabel === 'Tabela') {
			this.fetchTableData();
		}

		if (event.tab.textLabel === 'Wybory kolejki') {
			this.fetchStatsData();
		}
	}

	public ngOnDestroy() {
		if (this.roundSubscription) {
			this.roundSubscription.unsubscribe();
		}
	}
}

