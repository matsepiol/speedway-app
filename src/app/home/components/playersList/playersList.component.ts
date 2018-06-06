import { countBy, orderBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { FilterPipe } from '../../../shared/filterPipe/filterPipe';
import {
    Filter, juniorPlaceholder, Player, PlayerType, seniorPlaceholder, teamPlaceholder,
    zagranicznyPlaceholder,
} from '../../home.model';
import { DataService } from '../../services/data.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-players-list',
  templateUrl: './playersList.component.html',
  styleUrls: ['./playersList.component.scss']
})

export class PlayersListComponent implements OnInit {

  @Input() public availablePlayers: Player[];
  public isLoading: boolean;
  public teamFilters: string[] = [];
  public typeFilters: string[] = [];
  public filter: Filter = { team: [], type: [], sort: 'team', searchQuery: '' };
  public ksmSum = 0;
  public ksmLeft = 45;
  public selectedPlayers: BehaviorSubject<Player[]> = new BehaviorSubject([]);
  private fullSquadQuantity = 7;


  constructor(
    private dataService: DataService,
    private snackBarService: SnackBarService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.init();
  }

  public init(): void {

    this.selectedPlayers.next(teamPlaceholder);
    this.dataService.getData()
    .pipe(finalize(() => { this.isLoading = false; }))
    .subscribe((data: Player[]) => {
      this.availablePlayers = data;
      this.prepareFiltering();
    });

    this.selectedPlayers.subscribe( (selected) => {
      this.calculateKsmSum();
    });
  }

  public selectPlayer(player: Player): void {
    // if (!this.checkSquadRequirements(player)) {
    //   return;
    // }

    const selectedPlayers = this.selectedPlayers.getValue();
    const index = this.findSquadIndex(player);
    if (index === -1) { return; }

    selectedPlayers[index] = player;
    this.selectedPlayers.next(selectedPlayers);

    this.availablePlayers = this.availablePlayers.filter((p) => p.name !== player.name);
  }

  public unselectPlayer(player: Player, index: number): void {
    const selectedPlayers = this.selectedPlayers.getValue();
    this.availablePlayers.push(player);

    if (index === 0 || index === 4) {
      selectedPlayers[index] = seniorPlaceholder;
    } else if (index > 4) {
      selectedPlayers[index] = juniorPlaceholder;
    } else {
      selectedPlayers[index] = zagranicznyPlaceholder;
    }

    this.selectedPlayers.next(selectedPlayers);

  }

  public calculateKsmSum(): void {
    const selectedPlayers = this.selectedPlayers.getValue();
    console.log(selectedPlayers);

    this.ksmSum = selectedPlayers.length
      ? parseFloat(selectedPlayers.map(item => item.ksm || 0).reduce((a, b) => a + b).toFixed(2))
      : 0;

    this.ksmLeft = parseFloat((45 - this.ksmSum).toFixed(2));
  }

  private checkSquadRequirements(player: Player): boolean {
    const selectedPlayers = this.selectedPlayers.getValue();
    const playersCount = countBy(selectedPlayers, 'type');

    if (selectedPlayers.length >= this.fullSquadQuantity) {
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

  public clearFilters(): void {
    this.filter = { team: [], type: [], sort: 'team', searchQuery: '' };
  }

  public clearSquad(): void {
    this.selectedPlayers.next([]);
    this.init();
  }

  private prepareFiltering(): void {
    this.teamFilters = this.availablePlayers.map(item => item.team)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.typeFilters = this.availablePlayers.map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private findSquadIndex(player: Player): number {
    const selectedPlayers = this.selectedPlayers.getValue();
    let index;

    if (player.type === PlayerType.ZAGRANICZNY) {
      index = selectedPlayers.findIndex( item => item.type === PlayerType.ZAGRANICZNY && item.placeholder);
      if (index === -1) {
        this.snackBarService.messageError('Za dużo zagranicznych');
      }
    }

    if (player.type === PlayerType.SENIOR) {
      index = selectedPlayers.findIndex( item => item.type === PlayerType.SENIOR && item.placeholder);
      if (index === -1) {
        index = selectedPlayers.findIndex( item => item.type === PlayerType.ZAGRANICZNY && item.placeholder);
        if (index === -1) {
          this.snackBarService.messageError('Musisz dodać juniora');
        }
      }
    }

    if (player.type === PlayerType.JUNIOR) {
      index = selectedPlayers.findIndex( item => item.type === PlayerType.JUNIOR && item.placeholder);

      if (index === -1) {
        index = selectedPlayers.findIndex( item => item.placeholder);
        if (index === -1) {
          this.snackBarService.messageError('Skład jest pełny');
        }
      }
    }
    return index;
  }

}
