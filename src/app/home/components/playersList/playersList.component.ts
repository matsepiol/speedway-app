import { clone, countBy } from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
  Filter, Player, teamPlaceholder,
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
  public filter: Filter = { team: [], type: [], sort: 'team', searchQuery: '', showPossiblePlayers: false };
  public ksmSum = 0;
  public selectedPlayers: Player[] = [];

  constructor(
    public dataService: DataService,
    private snackBarService: SnackBarService,
    public snackBar: MatSnackBar,
    public clipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.init();
  }

  public init(): void {
    this.dataService.setSelection(clone(teamPlaceholder));
    this.dataService.getData()
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((data: Player[]) => {
        this.availablePlayers = data;
        this.prepareFiltering();
      });

    this.dataService.getSelection().subscribe((selected) => {
      this.selectedPlayers = selected;
    });
  }

  public selectPlayer(player: Player): void {
    this.dataService.selectPlayer(player);
    this.availablePlayers = this.availablePlayers.filter((p) => p.name !== player.name);
  }

  public unselectPlayer(player: Player, index: number): void {
    this.availablePlayers.push(player);
    this.dataService.unselectPlayer(player, index);
  }

  public clearFilters(): void {
    this.filter = { team: [], type: [], sort: 'team', searchQuery: '', showPossiblePlayers: false };
  }

  public exportSquad(): void {
    if ((countBy(this.selectedPlayers, 'placeholder').true)) {
      this.snackBarService.messageError('Skład nie jest kompletny!');
    } else if (this.dataService.ksmSumSubject.getValue() > 45) {
      this.snackBarService.messageError('Skład przekracza dopuszczalny ksm!');
    } else {
      let textToCopy = '';
      this.selectedPlayers.forEach((selected, index) => {
        textToCopy += `${index + 1}. ${selected.name} `;
      });
      textToCopy += ` Ksm: ${this.dataService.ksmSumSubject.getValue()}`;
      this.clipboardService.copyFromContent(textToCopy);
      this.snackBarService.messageSuccess('Skład skopiowany do schowka!');
    }
  }

  public clearSquad(): void {
    this.dataService.setSelection(clone(teamPlaceholder));
    this.init();
  }

  private prepareFiltering(): void {
    this.teamFilters = this.availablePlayers.map(item => item.team)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.typeFilters = this.availablePlayers.map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

}
