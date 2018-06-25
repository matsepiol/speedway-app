import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@app/home/services/snack-bar.service';

import { DataService } from '../home/services/data.service';
import { Users } from '@app/users.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  public isLoading = false;
  public currentRound = 9;
  public roundsQuantity = 14;
  public roundsIterable = Array(this.roundsQuantity).fill(0).map((x, i) => i + 1);
  public squads: any = [];
  public loadingMessage = 'Wczytywanie...';
  public users = Users;
  public isUserSquadSent: boolean;

  constructor(
    public dataService: DataService,
    private snackBarService: SnackBarService,
  ) {

  }

  public ngOnInit(): void {
    this.fetchRoundSquad();
  }

  private fetchRoundSquad() {
    this.isLoading = true;
    this.squads = [];

    this.dataService.getRoundSquads(
      this.currentRound,
      JSON.parse(localStorage.getItem('currentUser')).user.uid
    ).valueChanges().subscribe((team: any) => {
      this.isUserSquadSent = !!team.length;
    });

    Object.keys(Users).forEach((userId) => {
      this.dataService.getRoundSquads(this.currentRound, userId).valueChanges().subscribe((team: any) => {
        this.squads.push({ userId, team, results: [] });
      });
    });

    this.dataService.getRoundScore(this.currentRound).valueChanges().subscribe((scores) => {
      this.squads.forEach((squad: any) => {
        let scoreSum = 0;
        let bonusSum = 0;
        squad.team.forEach((player: any) => {
          scores.forEach((score) => {
            if (player === score.name) {
              scoreSum += score.score;
              bonusSum += score.bonus;
              squad.results.push(score);
            }

          });
          squad.scoreSum = scoreSum;
          squad.bonusSum = bonusSum;
        });

        if (scoreSum) {
          this.dataService.setRoundResult(squad.userId, this.currentRound, [squad.scoreSum, squad.bonusSum]);
        }
      });

      this.isLoading = false;
    });
  }


  public onRoundChange(): void {
    this.fetchRoundSquad();
  }
}
