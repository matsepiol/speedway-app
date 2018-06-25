import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@app/home/services/snack-bar.service';
import { clone } from 'lodash';

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
  public squads = [];
  public loadingMessage = 'Wczytywanie...';
  public users = Users;

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
    Object.keys(Users).forEach((userId) => {
      this.dataService.getRoundSquads(this.currentRound, userId).valueChanges().subscribe((team: any) => {
        console.log(team);
        this.squads.push({ userId, team, results: [] });
      });
    });

    this.dataService.getRoundScore(this.currentRound).valueChanges().subscribe( (scores) => {
      this.squads.forEach( (squad) => {
        squad.team.forEach( (player) => {

          scores.forEach( (score) => {
            if (player === score.name) {
              squad.results.push(score);
            }
          });
        });
      });
      console.log(this.squads);
      this.isLoading = false;
    });
  }


  public onRoundChange(): void {
    this.fetchRoundSquad();
  }
}
