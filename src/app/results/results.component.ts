import { Component, OnInit } from '@angular/core';
import { DataService } from '../home/services/data.service';
import { Users } from '@app/users.model';
import { find, orderBy } from 'lodash';
import { MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { Squad } from './result.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  public currentRound = 1;
  public currentStatsRound = this.currentRound;
  public isLoading = false;
  public isUserSquadSent: boolean;
  public loadingMessage = 'Wczytywanie...';
  public roundsQuantity = 14;
  public roundsIterable = Array(this.roundsQuantity).fill(0).map((x, i) => i + 1);
  public squads: Squad[] = [];
  public users = Users;
  public tableData: any[] = [];
  public dataSource: any;
  public statsData: any[] = [];
  public statsTableData: any;

  displayedStatsColumns: string[] = ['position', 'name', 'score', 'ksm', 'ratio'];

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

  public fetchStatsData(): void {
    this.isLoading = true;
    this.statsData = [];

    this.dataService.getData().valueChanges().subscribe((players: any) => {
      this.dataService.getRoundScore(this.currentStatsRound).valueChanges().subscribe((scores: any) => {
        players.forEach( (player: any) => {
          const playerScore: any = find(scores, { 'name': player.name });
          player.score = playerScore.score;
          player.ratio = parseFloat((player.score / player.ksm).toFixed(2));
          this.statsData.push(player);
        });

        this.statsData = orderBy(this.statsData, ['ratio'], ['desc']).filter(player => player.score);
        this.statsTableData = new MatTableDataSource(this.statsData);
        this.isLoading = false;
      });
    });
  }

  public onRoundChange(): void {
    this.fetchRoundSquad();
  }

  public onStatsRoundChange(): void {
    this.fetchStatsData();
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
          this.isLoading = false;
        });
      });
    }

    if (event.tab.textLabel === 'Wybory kolejki' && !this.statsData.length) {
      this.fetchStatsData();
    }
  }
}

