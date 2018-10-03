import { Component, OnInit } from '@angular/core';
import { Users } from '@app/users.model';
import { MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { DataService } from '../home/services/data.service';
import { StatsData, TableData, Squad } from '@app/results/result.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {
  public seasonIterable = [2018];
  public currentSeason = this.seasonIterable[0];
  public roundsQuantity = 14;
  public currentRound = this.roundsQuantity;
  public roundsIterable = Array(this.roundsQuantity).fill(0).map((x, i) => i + 1);
  public squads: StatsData[] = [];
  public isLoading = false;
  public users = Users;
  public tableData: TableData[] = [];
  public dataSource: MatTableDataSource<TableData>;
  public loadingMessage = 'Wczytywanie...';

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

    this.dataService.getHistorySquads(this.currentSeason, this.currentRound).subscribe((squads: StatsData[]) => {
      this.squads = squads;
      this.isLoading = false;
    });
  }

  public onSelect(event: MatTabChangeEvent): void {
    if (event.tab.textLabel === 'Tabela' && !this.tableData.length) {
      this.dataService.getHistoryTable(this.currentSeason).subscribe((table: TableData[]) => {
        this.dataSource = new MatTableDataSource(table);
        this.isLoading = false;
      });
    }
  }
}

