import { countBy, orderBy } from 'lodash';
import { finalize } from 'rxjs/operators';

import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { DataService } from '../../services/data.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { FilterPipe } from '../../../shared/filterPipe/filterPipe';

enum PlayerType {
  SENIOR = 'Senior',
  ZAGRANICZNY = 'Zagraniczny',
  JUNIOR = 'Junior',
}

interface Player {
  name: string;
  type: PlayerType;
  ksm: number;
  team: string;
}

interface Filter {
  team: string[];
  type: string[];
  sort: string;
}

@Component({
  selector: 'app-players-list',
  templateUrl: './playersList.component.html',
  styleUrls: ['./playersList.component.scss']
})

export class PlayersListComponent implements OnInit {

  @Input() public availablePlayers: Player[];

  public isLoading: boolean;
  public selectedPlayers: Player[] = [];
  public teamFilters: string[] = [];
  public typeFilters: string[] = [];
  public filter: Filter = { team: [], type: [], sort: 'team' };
  public ksmSum = 0;
  public ksmLeft = 45;
  private fullSquadQuantity = 7;

  constructor(
    private dataService: DataService,
    private snackBarService: SnackBarService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.dataService.getData()
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((data: Player[]) => {
        this.availablePlayers = data;
        this.prepareFiltering();
      });
  }

  public selectPlayer(player: Player) {
    if (!this.checkSquadRequirements(player)) {
      return;
    }

    this.selectedPlayers.push(player);
    this.availablePlayers = this.availablePlayers.filter((p) => p.name !== player.name);
    this.calculateKsmSum();
  }

  public unselectPlayer(player: Player) {
    this.availablePlayers.push(player);

    this.selectedPlayers = this.selectedPlayers
      .filter((p) => p.name !== player.name);

    this.calculateKsmSum();
  }

  public calculateKsmSum() {
    this.ksmSum = this.selectedPlayers.length
      ? parseFloat(this.selectedPlayers.map(item => item.ksm).reduce((a, b) => a + b).toFixed(2))
      : 0;

    this.ksmLeft = parseFloat((45 - this.ksmSum).toFixed(2));
  }

  private checkSquadRequirements(player: Player): boolean {
    const playersCount = countBy(this.selectedPlayers, 'type');

    if (this.selectedPlayers.length >= this.fullSquadQuantity) {
      this.snackBarService.messageError('Skład jest kompletny');
      return false;
    }

    if (player.type === PlayerType.ZAGRANICZNY) {
      if (playersCount.Zagraniczny >= 3) {
        this.snackBarService.messageError('Za dużo zagranicznych');
        return false;
      }

      if (playersCount.Zagraniczny + (playersCount.Senior || 0) >= 5) {
        this.snackBarService.messageError('Musisz dodać juniora');
        return false;
      }
    }

    if (player.type === PlayerType.SENIOR && playersCount.Senior + (playersCount.Zagraniczny || 0) >= 5) {
      this.snackBarService.messageError('Musisz dodać juniora');
      return false;
    }

    return true;
  }

  private prepareFiltering() {
    this.teamFilters = this.availablePlayers.map(item => item.team)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.typeFilters = this.availablePlayers.map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}
