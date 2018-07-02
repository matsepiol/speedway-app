import { Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from '../home/services/data.service';
import { Users } from '@app/users.model';
import { find } from 'lodash';
import { MatSort, MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { Squad } from './result.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  public currentRound = 10;
  public isLoading = false;
  public isUserSquadSent: boolean;
  public loadingMessage = 'Wczytywanie...';
  public roundsQuantity = 14;
  public roundsIterable = Array(this.roundsQuantity).fill(0).map((x, i) => i + 1);
  public squads: Squad[] = [];
  public users = Users;
  public tableData: any[] = [];
  public dataSource: any;
  displayedColumns: string[] = ['position', 'userName', 'scoreSum', 'bonusSum'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dataService: DataService,
  ) {
  }

  public ngOnInit(): void {
    this.fetchRoundSquad();
  }

  private fetchRoundSquad(): void {
    this.isLoading = true;
    this.squads = [];

    this.dataService.getRoundSquads(
      this.currentRound,
      JSON.parse(localStorage.getItem('currentUser')).user.uid
    ).valueChanges().subscribe((team: string[]) => {
      this.isUserSquadSent = !!team.length;
    });

    Object.keys(Users).forEach((userId) => {
      this.dataService.getRoundSquads(this.currentRound, userId).valueChanges().subscribe((team: string[]) => {
        this.squads.push({ userId, team, results: [] });
      });
    });

    this.dataService.getRoundScore(this.currentRound).valueChanges().subscribe((scores) => {
      this.squads.forEach((squad) => {
        squad.results = [];
        squad.scoreSum = 0;
        squad.bonusSum = 0;
        squad.team.forEach((player: any) => {
          const playerScore = find(scores, { 'name': player });
          squad.scoreSum += playerScore ? playerScore.score : 0;
          squad.bonusSum += playerScore ? playerScore.bonus : 0;
          squad.results.push(playerScore);
        });

        if (squad.scoreSum) {
          this.dataService.setRoundResult(squad.userId, this.currentRound, [squad.scoreSum, squad.bonusSum]);
        }
      });

      this.isLoading = false;
    });
  }


  public onRoundChange(): void {
    this.fetchRoundSquad();
  }

  public onSelect(event: MatTabChangeEvent): void {
    if (event.tab.textLabel === 'Tabela' && !this.tableData.length) {

      this.isLoading = true;
      Object.keys(Users).forEach((userId) => {
        this.dataService.getRoundResult(userId).valueChanges().subscribe((data) => {
          const playerScore = find(this.tableData, { 'userName': this.users[userId] });
          if (playerScore) {
            playerScore.scoreSum = data.reduce((a: number, b) => a + parseInt(b[0], 10), 0);
            playerScore.bonusSum = data.reduce((a: number, b) => a + parseInt(b[1], 10), 0);
          } else {
            this.tableData.push({
              userName: this.users[userId],
              scoreSum: data.reduce((a: number, b) => a + parseInt(b[0], 10), 0),
              bonusSum: data.reduce((a: number, b) => a + parseInt(b[1], 10), 0),
            });
          }

          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        });
      });

    }
  }
}
