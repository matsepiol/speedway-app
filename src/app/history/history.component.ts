import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSelectChange } from '@angular/material/select';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

import { Users } from '@app/users.model';
import { StatsData, TableData } from '@app/results/result.model';
import { ROUNDS_QUANTITY, ROUNDS_ITERABLE } from '@app/variables';
import { Store } from '../home/services/store.service';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {
	public seasonIterable = [2018, 2019];
	public roundsIterable = ROUNDS_ITERABLE;
	public users = Users;
	public loadingMessage = 'Wczytywanie...';

	private _chosenSeasonSubject = new BehaviorSubject<number>(null);
	public chosenSeason$: Observable<number> = this._chosenSeasonSubject.asObservable();

	private _chosenRoundSubject = new BehaviorSubject<number>(null);
	public chosenRound$: Observable<number> = this._chosenRoundSubject.asObservable();

	private _isLoadingSubject = new BehaviorSubject<boolean>(true);
	public isLoading$: Observable<boolean> = this._isLoadingSubject.asObservable();

	public squads$: Observable<StatsData[]>;
	public dataSource$: Observable<MatTableDataSource<TableData>>;

	constructor(
		public store: Store,
	) {
	}

	public ngOnInit(): void {
		this._chosenSeasonSubject.next(this.seasonIterable[0]);
		this._chosenRoundSubject.next(ROUNDS_QUANTITY);

		this.squads$ = combineLatest(
			this.chosenSeason$,
			this.chosenRound$
		).pipe(
			tap(() => this._isLoadingSubject.next(true)),
			switchMap(([season, round]) => this.store.getHistorySquads(season, round)),
			tap(() => this._isLoadingSubject.next(false)),
		);
	}

	private fetchTableData(): void {
		this.dataSource$ = this.chosenSeason$.pipe(
			tap(() => this._isLoadingSubject.next(true)),
			switchMap(season => this.store.getHistoryTable(season)),
			map(table => new MatTableDataSource(table)),
			tap(() => this._isLoadingSubject.next(false)),
		);
	}

	public changeRound(event: MatSelectChange): void {
		this._chosenRoundSubject.next(event.value);
	}

	public changeSeason(event: MatSelectChange): void {
		this._chosenSeasonSubject.next(event.value);
	}

	public onSelect(event: MatTabChangeEvent): void {
		if (event.tab.textLabel === 'Tabela') {
			this.fetchTableData();
		}
	}
}

