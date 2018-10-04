import { clone, countBy } from 'lodash';
import { ClipboardService } from 'ngx-clipboard';

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { Filter, Player, teamPlaceholder } from '../../home.model';
import { DataService } from '../../services/data.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { ConfirmationDialogComponent } from '@app/home/components/confirmationDialog/confirmation-dialog.component';
import { AuthenticationService } from '@app/authentication/authentication.service';

@Component({
  selector: 'app-players-list',
  templateUrl: './playersList.component.html',
  styleUrls: ['./playersList.component.scss']
})

export class PlayersListComponent implements OnInit {

  public availablePlayers: Player[];
  public isLoading: boolean;
  public isUserSquadSent = false;
  public loadingMessage = 'Wczytywanie...';
  public teamFilters: string[] = [];
  public typeFilters: string[] = [];
  public filter: Filter = {
    team: [], type: [], sort: 'ksm', searchQuery: '', showPossiblePlayers: false, showMinimum: false
  };
  public selectedPlayers: Player[] = [];
  private currentRound = 1;
  private confirmationDialog: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    public authenticationService: AuthenticationService,
    public clipboardService: ClipboardService,
    public dataService: DataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private snackBarService: SnackBarService,
  ) { }

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
    const initialSelection = JSON.parse(localStorage.getItem('teamSelection')) || clone(teamPlaceholder);
    this.dataService.setSelection(initialSelection);

    this.isLoading = true;
    this.dataService.getData().subscribe((data) => {
      this.isLoading = false;
      this.availablePlayers = data.filter(
        players => this.selectedPlayers.every(selection => selection.name !== players.name)
      );
      this.prepareFiltering();
    });

    this.dataService.getSelection().subscribe((selected) => {
      this.selectedPlayers = selected;
      this.saveSelectionToLocalStorage(selected);
    });

    this.dataService.getRoundSquads(
      this.currentRound,
      JSON.parse(localStorage.getItem('currentUser')).user.uid
    ).subscribe((team) => {
      this.isUserSquadSent = !!team.length;
    });
  }

  public selectPlayer(player: Player): void {
    const selectionSuccess = this.dataService.selectPlayer(player);
    if (selectionSuccess) {
      this.availablePlayers = this.availablePlayers.filter((p) => p.name !== player.name);
    }
    this.filter.searchQuery = '';
  }

  public unselectPlayer(player: Player, index: number): void {
    this.availablePlayers.push(player);
    this.dataService.unselectPlayer(player, index);
  }

  public clearFilters(): void {
    this.filter = {
      team: [],
      type: [],
      sort: 'ksm',
      searchQuery: '',
      showPossiblePlayers: false,
      showMinimum: this.filter.showMinimum
    };
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

  public sendSquad(): void {
    const playersToSend = this.selectedPlayers.map((player) => {
      return player['name'];
    });

    this.confirmationDialog = this.dialog.open(ConfirmationDialogComponent, { width: '400px' });
    this.confirmationDialog.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.sendSquad(playersToSend, this.currentRound).then(() => {
          this.snackBarService.messageSuccess('Wyniki wysłane!');
        });
      }
    });
  }

  public clearSquad(): void {
    this.dataService.setSelection(clone(teamPlaceholder));
    this.init();
  }

  private saveSelectionToLocalStorage(selection: Player[]) {
    localStorage.setItem('teamSelection', JSON.stringify(selection));
  }

  private prepareFiltering(): void {
    this.teamFilters = this.availablePlayers.map(item => item.team)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.typeFilters = this.availablePlayers.map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  public disableSendSquadButton(): boolean {
    return !!(countBy(this.selectedPlayers, 'placeholder').true)
      || this.dataService.ksmSumSubject.getValue() > 45;
    //     || new Date() > new Date(2018, 7, 26, 17, 0, 0);
  }

}
