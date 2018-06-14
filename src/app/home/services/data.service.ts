import { BehaviorSubject, Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';

import {
  juniorPlaceholder, obcokrajowiecPlaceholder, Player, PlayerType, seniorPlaceholder
} from '../home.model';
import { SnackBarService } from '../services/snack-bar.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class DataService {
  public maxKsm = 45;
  public selectedPlayersSubject: BehaviorSubject<Player[]> = new BehaviorSubject([]);
  public ksmSumSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  public ksmLeftSubject: BehaviorSubject<number> = new BehaviorSubject(this.maxKsm);

  constructor(
    private snackBarService: SnackBarService,
    private db: AngularFireDatabase
  ) {}

  public getData(): AngularFireList<Player[]> {
    return this.db.list<Player[]>('/data');
  }

  public setSelection(selection: Player[]): void {
    this.selectedPlayersSubject.next(selection);
    this.calculateKsmSum();
  }

  public getSelection(): Observable<Player[]> {
    return this.selectedPlayersSubject.asObservable();
  }

  public getKsmSum(): Observable<number> {
    return this.ksmSumSubject.asObservable();
  }

  public getKsmLeft(): Observable<number> {
    return this.ksmLeftSubject.asObservable();
  }

  public selectPlayer(player: Player): boolean {
    const selectedPlayers = this.selectedPlayersSubject.getValue();
    const index = this.findSquadIndex(player);
    if (index === -1) {
      return false;
    }

    selectedPlayers[index] = player;
    this.setSelection(selectedPlayers);
    return true;
  }

  public unselectPlayer(player: Player, index: number): void {
    const selectedPlayers = this.selectedPlayersSubject.getValue();

    if (index === 0 || index === 4) {
      for (let i = 1; i < 4; i++) {
        if (selectedPlayers[i].type === PlayerType.SENIOR) {
          selectedPlayers[index] = selectedPlayers[i];
          selectedPlayers[i] = obcokrajowiecPlaceholder;
          this.setSelection(selectedPlayers);
          return;
        }
      }
      selectedPlayers[index] = seniorPlaceholder;
    } else if (index > 4) {
      for (let i = 0; i <= 4; i++) {
        if (selectedPlayers[i].type === PlayerType.JUNIOR) {
          selectedPlayers[index] = selectedPlayers[i];
          if (i === 0 || i === 4) {
            selectedPlayers[i] = seniorPlaceholder;
          } else {
            selectedPlayers[i] = obcokrajowiecPlaceholder;
          }
          this.setSelection(selectedPlayers);
          return;
        }
      }
      selectedPlayers[index] = juniorPlaceholder;
    } else {
      selectedPlayers[index] = obcokrajowiecPlaceholder;
    }

    this.setSelection(selectedPlayers);

  }

  private calculateKsmSum(): void {
    const selectedPlayers = this.selectedPlayersSubject.getValue();

    const ksmSum = selectedPlayers.length
      ? parseFloat(selectedPlayers.map(item => item.ksm || 0).reduce((a, b) => a + b).toFixed(2))
      : 0;

    const ksmLeft = parseFloat((this.maxKsm - ksmSum).toFixed(2));

    this.ksmSumSubject.next(ksmSum);
    this.ksmLeftSubject.next(ksmLeft);
  }

  private findSquadIndex(player: Player): number {
    const selectedPlayers = this.selectedPlayersSubject.getValue();
    let index;

    if (player.type === PlayerType.OBCOKRAJOWIEC) {
      index = selectedPlayers.findIndex(item => item.type === PlayerType.OBCOKRAJOWIEC && item.placeholder);
      if (index === -1) {
        this.snackBarService.messageError('Za dużo obcokrajowców');
      }
    }

    if (player.type === PlayerType.SENIOR) {
      index = selectedPlayers.findIndex(item => item.type === PlayerType.SENIOR && item.placeholder);
      if (index === -1) {
        index = selectedPlayers.findIndex(item => item.type === PlayerType.OBCOKRAJOWIEC && item.placeholder);
        if (index === -1) {
          this.snackBarService.messageError('Musisz dodać juniora');
        }
      }
    }

    if (player.type === PlayerType.JUNIOR) {
      index = selectedPlayers.findIndex(item => item.type === PlayerType.JUNIOR && item.placeholder);

      if (index === -1) {
        index = selectedPlayers.findIndex(item => item.placeholder);
        if (index === -1) {
          this.snackBarService.messageError('Skład jest pełny');
        }
      }
    }
    return index;
  }

}
