import { Component, OnInit, OnDestroy } from '@angular/core';
import { Users } from '@app/users.model';
import { MatTableDataSource, MatTabChangeEvent, MatSelectChange } from '@angular/material';
import { Store } from '../home/services/store.service';
import { StatsData, TableData, Squad } from '@app/results/result.model';
import { ROUNDS_QUANTITY, ROUNDS_ITERABLE } from '@app/variables';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {
	public seasonIterable = [2018];
	public roundsIterable = ROUNDS_ITERABLE;
	public users = Users;
	public loadingMessage = 'Wczytywanie...';

	private chosenSeasonSubject = new BehaviorSubject<number>(null);
	public chosenSeason$: Observable<number> = this.chosenSeasonSubject.asObservable();

	private chosenRoundSubject = new BehaviorSubject<number>(null);
	public chosenRound$: Observable<number> = this.chosenRoundSubject.asObservable();

	private isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

	public squads$: Observable<StatsData[]>;
	public dataSource$: Observable<MatTableDataSource<TableData>>;

	constructor(
		public store: Store,
	) {
	}

	public ngOnInit(): void {
		this.chosenSeasonSubject.next(this.seasonIterable[0]);
		this.chosenRoundSubject.next(ROUNDS_QUANTITY);

		this.squads$ = combineLatest(
			this.chosenSeason$,
			this.chosenRound$
		).pipe(
			tap(() => this.isLoadingSubject.next(true)),
			switchMap(([season, round]) => this.store.getHistorySquads(season, round)),
			tap(() => this.isLoadingSubject.next(false)),
		);
	}

	private fetchTableData() {
		this.dataSource$ = this.chosenSeason$.pipe(
			tap(() => this.isLoadingSubject.next(true)),
			switchMap(season => this.store.getHistoryTable(season)),
			map(table => new MatTableDataSource(table)),
			tap(() => this.isLoadingSubject.next(false)),
		);
	}

	public changeRound(event: MatSelectChange): void {
		this.chosenRoundSubject.next(event.value);
	}

	public changeSeason(event: MatSelectChange): void {
		this.chosenSeasonSubject.next(event.value);
	}

	public onSelect(event: MatTabChangeEvent): void {
		if (event.tab.textLabel === 'Tabela') {
			this.fetchTableData();
		}
	}
}

