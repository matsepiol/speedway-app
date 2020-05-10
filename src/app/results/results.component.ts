import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSelectChange } from '@angular/material/select';

import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map, tap, switchMap, first } from 'rxjs/operators';

import { find, orderBy } from 'lodash';

import { Users } from '@app/users.model';
import { TableData } from '@app/scores/scores.model';
import { ROUNDS_ITERABLE } from '@app/variables';
import { Store } from '../home/services/store.service';
import { Squad, StatsData } from './result.model';
import { PlayerResult } from '../home/home.model';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
	public loadingMessage = 'Wczytywanie...';
	public roundsIterable = ROUNDS_ITERABLE;
	public users = Users;
	public displayedStatsColumns: string[] = ['position', 'name', 'score', 'ksm', 'ratio'];

	private _chosenRoundSubject = new BehaviorSubject<number>(null);
	public chosenRound$: Observable<number> = this._chosenRoundSubject.asObservable();

	private _isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this._isLoadingSubject.asObservable();

	public isUserSquadSent$: Observable<boolean>;
	public squads$: Observable<Squad[]>;
	public tableData$: Observable<MatTableDataSource<TableData>>;
	public statsData$: Observable<MatTableDataSource<StatsData>>;

	constructor(public store: Store) {}

	public ngOnInit(): void {
		this.store.options$.pipe(
			first(options => !!options.currentRound)
		).subscribe(options => this._chosenRoundSubject.next(options.currentRound));

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
			tap(() => this._isLoadingSubject.next(true)),
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
			tap(() => this._isLoadingSubject.next(false)),

		);
	}

	public changeRound(event: MatSelectChange): void {
		this._chosenRoundSubject.next(event.value);
	}

	private _fetchStatsData(): void {
		this.statsData$ = this.chosenRound$.pipe(
			switchMap(round => {
				return combineLatest(
					this.store.data$,
					this.store.getRoundScore(round),
					this.chosenRound$
				);
			}),
			tap(() => this._isLoadingSubject.next(true)),
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
			tap(() => this._isLoadingSubject.next(false)),
		);
	}

	private _fetchTableData(): void {
		this.tableData$ = this.store.getRoundResult().pipe(
			tap(() => this._isLoadingSubject.next(true)),
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
			tap(() => this._isLoadingSubject.next(false)),
		);
	}

	public onSelect(event: MatTabChangeEvent): void {
		if (event.tab.textLabel === 'Tabela') {
			this._fetchTableData();
		}

		if (event.tab.textLabel === 'Wybory kolejki') {
			this._fetchStatsData();
		}
	}
}

