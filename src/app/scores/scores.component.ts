import { each, flatten, groupBy, pick } from 'lodash';

import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@app/home/services/snack-bar.service';

import { DataService } from '../home/services/data.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})

export class ScoresComponent implements OnInit {
  public teams: any;
  public isLoading: boolean;
  public currentRound = 9;
  public roundsQuantity = 14;
  public roundsIterable = Array(this.roundsQuantity).fill(0).map((x, i) => i + 1);
  public loadingMessage = 'Wczytywanie...';

  constructor(
    public dataService: DataService,
    private snackBarService: SnackBarService,
  ) {

  }

  public ngOnInit(): void {
    this.dataService.getData().valueChanges().subscribe((data: any) => {

      this.teams = Object.values(groupBy(data, 'team'));
      this.fetchRoundScore();
    });

  }

  public onRoundChange(): void {
    this.fetchRoundScore();
  }

  private fetchRoundScore(): void {
    this.isLoading = true;

    this.dataService.getRoundScore(this.currentRound).valueChanges().subscribe((data) => {
      each(this.teams, (team) => {
        each(team, (player) => {
          player.score = 0;
          player.bonus = 0;
          each(data, (score) => {
            if (score.name === player.name) {
              player.score = parseInt(score.score, 10);
              player.bonus = parseInt(score.bonus, 10);
            }
          });
        });
      });
      this.isLoading = false;
    });
  }

  public save(): void {
    const savedPlayers: any[] = [];
    each(flatten(this.teams), (player) => {
      savedPlayers.push(pick(player, ['name', 'score', 'bonus']));
    });

    this.dataService.saveResults(savedPlayers, this.currentRound).then(() => {
      this.snackBarService.messageSuccess('Wyniki zapisane');
    });
  }

}
