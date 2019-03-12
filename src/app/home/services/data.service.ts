import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
	juniorPlaceholder, obcokrajowiecPlaceholder, Player, PlayerResult, PlayerType, seniorPlaceholder
} from '../home.model';
import { SnackBarService } from '../services/snack-bar.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { StatsData } from '@app/results/result.model';
import { TableData } from '@app/scores/scores.model';
import { CURRENT_ROUND } from '@app/variables';

@Injectable()
export class DataService {
	public maxKsm = 45;
	private selectedPlayersSubject: BehaviorSubject<Player[]> = new BehaviorSubject([]);
	private ksmSumSubject: BehaviorSubject<number> = new BehaviorSubject(0);
	private ksmLeftSubject: BehaviorSubject<number> = new BehaviorSubject(this.maxKsm);
	private currentRound = CURRENT_ROUND;

	constructor(
		private snackBarService: SnackBarService,
		private authenticationService: AuthenticationService,
		private db: AngularFireDatabase
	) { }

	public getData(): Observable<Player[]> {
		return this.db.list<Player>('/data').valueChanges();
	}

	public getRoundScore(round: number): Observable<PlayerResult[]> {
		return this.db.list<PlayerResult>(`/scores/${round}`).valueChanges();
	}

	public saveResults(savedPlayers: PlayerResult[], round: number): Promise<void> {
		return this.db.object(`scores/${round}`).set(savedPlayers);
	}

	public changePlayersData(players: Player[]): Promise<void> {
		return this.db.object(`data`).set(players);
	}

	public getRoundSquads(round: number, id: string): Observable<string[]> {
		return this.db.list<string>(`/squads/${round}/${id}`).valueChanges();
	}

	public getHistorySquads(season: number, round: number): Observable<StatsData[]> {
		return this.db.list<StatsData>(`/history/${season}/squads/${round}`).valueChanges();
	}

	public getHistoryTable(season: number): Observable<TableData[]> {
		return this.db.list<TableData>(`/history/${season}/table`).valueChanges();
	}

	public sendSquad(playersToSend: string[], round: number): Promise<void> {
		const id = this.authenticationService.userDetails.uid;
		// const id = 'irHsihWshPXjcoEhmD3ryogcJCo1';

		return this.db.object(`squads/${round}/${id}`).set(playersToSend);
	}

	public getRoundResult(id: string): Observable<number[]> {
		return this.db.list<number>(`table/${id}`).valueChanges();
	}

	public setRoundResult(id: string, round: number, score: number[]): Promise<void> {
		return this.db.object(`table/${id}/${round}`).set(score);
	}

	public setSelection(selection: Player[]): void {
		this.selectedPlayersSubject.next(selection);
		this.calculateKsmSum();
	}

	public getSelection(): Observable<Player[]> {
		return this.selectedPlayersSubject.asObservable();
	}

	public getKsmValue(): number {
		return this.ksmSumSubject.getValue();
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
			? parseFloat(selectedPlayers
				.map(item => (item.ksm && item.ksm[this.currentRound - 1]) || 0)
				.reduce((a, b) => a + b).toFixed(2))
			: 0;

		const ksmLeft = parseFloat((this.maxKsm - ksmSum).toFixed(2));

		this.ksmSumSubject.next(ksmSum);
		this.ksmLeftSubject.next(ksmLeft);
	}

	private findSquadIndex(player: Player): number {
		const selectedPlayers = this.selectedPlayersSubject.getValue();
		let index;

		index = selectedPlayers.findIndex(item => item.placeholder);
		if (index === -1) {
			this.snackBarService.messageError('Skład jest pełny');
			return index;
		}

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
			}
		}
		return index;
	}

}
