import { Component, OnInit, OnDestroy } from '@angular/core';
import { Users } from '@app/users.model';
import { MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { DataService } from '../home/services/data.service';
import { StatsData, TableData } from '@app/results/result.model';
import { ROUNDS_QUANTITY, ROUNDS_ITERABLE } from '@app/variables';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit, OnDestroy {
	public seasonIterable = [2018];
	public currentSeason = this.seasonIterable[0];
	public currentRound = ROUNDS_QUANTITY;
	public roundsIterable = ROUNDS_ITERABLE;
	public squads: StatsData[] = [];
	public isLoading = false;
	public users = Users;
	public tableData: TableData[] = [];
	public dataSource: MatTableDataSource<TableData>;
	public loadingMessage = 'Wczytywanie...';
	private historySquadsSubscribtion: Subscription;
	historyTableSubscribtion: Subscription;

	constructor(
		public dataService: DataService,
	) {
	}

	public ngOnInit(): void {
		this.fetchHistorySquads();
	}

	public onRoundChange(): void {
		this.fetchHistorySquads();
	}

	public onSeasonChange(): void {
		this.fetchHistorySquads();
	}

	public fetchHistorySquads(): void {
		this.isLoading = true;
		this.squads = [];

		this.historySquadsSubscribtion = this.dataService.getHistorySquads(this.currentSeason, this.currentRound)
			.subscribe((squads: StatsData[]) => {
				this.squads = squads;
				this.isLoading = false;
			});
	}

	public onSelect(event: MatTabChangeEvent): void {
		if (event.tab.textLabel === 'Tabela' && !this.tableData.length) {
			this.historyTableSubscribtion = this.dataService.getHistoryTable(this.currentSeason)
				.subscribe((table: TableData[]) => {
					this.dataSource = new MatTableDataSource(table);
					this.isLoading = false;
				});
		}
	}

	public ngOnDestroy(): void {
		if (this.historySquadsSubscribtion) {
			this.historySquadsSubscribtion.unsubscribe();
		}

		if (this.historyTableSubscribtion) {
			this.historyTableSubscribtion.unsubscribe();
		}
	}
}

