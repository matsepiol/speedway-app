import { clone, countBy } from 'lodash';
import { ClipboardService } from 'ngx-clipboard';

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { Filter, Player, teamPlaceholder } from '../../home.model';
import { DataService } from '../../services/data.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { ConfirmationDialogComponent } from '@app/home/components/confirmationDialog/confirmation-dialog.component';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { PublicFeature } from '@angular/core/src/render3';

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
    this.dataService.setSelection(clone(teamPlaceholder));

    this.isLoading = true;
    this.dataService.getData().valueChanges().subscribe((data: any) => {
      this.isLoading = false;
      this.availablePlayers = data;
      this.prepareFiltering();
    });

    this.dataService.getSelection().subscribe((selected) => {
      this.selectedPlayers = selected;
    });

    this.dataService.getRoundSquads(
      10,
      JSON.parse(localStorage.getItem('currentUser')).user.uid
    ).valueChanges().subscribe((team: string[]) => {
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
        this.dataService.sendSquad(playersToSend, 10).then(() => {
          this.snackBarService.messageSuccess('Wyniki wysłane!');
        });
      }
    });
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

  public disableSendSquadButton(): boolean {
    return !!(countBy(this.selectedPlayers, 'placeholder').true)
      || this.dataService.ksmSumSubject.getValue() > 45
      || new Date() > new Date(2018, 6, 1, 17, 0, 0);
  } 

}
