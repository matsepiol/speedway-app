import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
	juniorPlaceholder, obcokrajowiecPlaceholder, Player, PlayerResult, PlayerType, seniorPlaceholder
} from '../home.model';
import { SnackBarService } from '../services/snack-bar.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { StatsData } from '@app/results/result.model';
import { TableData } from '@app/scores/scores.model';
import { Options } from '@app/playerManagment/playerManagment.model';

@Injectable()
export class DataService {
	public maxKsm = 45;

	private ksmSumSubject = new BehaviorSubject<number>(0);
	private ksmLeftSubject = new BehaviorSubject<number>(this.maxKsm);

	public ksmSum$: Observable<number> = this.ksmSumSubject.asObservable();
	public ksmLeft$: Observable<number> = this.ksmLeftSubject.asObservable();

	private dataSubject = new BehaviorSubject<Player[]>([]);
	public data$: Observable<Player[]> = this.dataSubject.asObservable();

	private availablePlayersSubject = new BehaviorSubject<Player[]>([]);
	public availablePlayers$: Observable<Player[]> = this.availablePlayersSubject.asObservable();

	private selectedPlayersSubject = new BehaviorSubject<Player[]>([]);
	public selectedPlayers$: Observable<Player[]> = this.selectedPlayersSubject.asObservable();

	private optionsSubject = new BehaviorSubject<Options>(
		{ currentRound: null, games: [], date: null, hour: null, minute: null }
	);
	public options$: Observable<Options> = this.optionsSubject.asObservable();

	private currentSquadSubject = new BehaviorSubject<string[]>([]);
	public currentSquad$: Observable<string[]> = this.currentSquadSubject.asObservable();

	constructor(
		private snackBarService: SnackBarService,
		private authenticationService: AuthenticationService,
		private db: AngularFireDatabase
	) {
		this.getOptions();
		this.getData();
	}

	public getData() {
		this.db.list<Player>('/data').valueChanges().subscribe(data => this.dataSubject.next(data));
	}

	public getOptions() {
		this.db.object<Options>(`options`).valueChanges().subscribe(options => this.optionsSubject.next(options));
	}

	public getCurrentRound() {
		return this.optionsSubject.getValue().currentRound;
	}

	public getCurrentRoundSquad() {
		this.getRoundSquads(this.getCurrentRound(), JSON.parse(localStorage.getItem('currentUser')).user.uid)
			.subscribe(team => this.currentSquadSubject.next(team));
	}

	public getRoundScore(round: number): Observable<PlayerResult[]> {
		return this.db.list<PlayerResult>(`/scores/${round}`).valueChanges();
	}

	public saveOptions(options: Options): Promise<void> {
		return this.db.object(`options`).set(options);
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
	}

	public getKsmValue(): number {
		return this.ksmSumSubject.getValue();
	}

	public getSelectedPlayersValue(): Player[] {
		return this.selectedPlayersSubject.getValue();
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

	public calculateKsmSum(): void {
		combineLatest(
			this.selectedPlayers$,
			this.options$
		).subscribe(([selectedPlayers, options]) => {
			const ksmSum = selectedPlayers.length
				? parseFloat(selectedPlayers
					.map(item => (item.ksm && item.ksm[options.currentRound - 1]) || 0)
					.reduce((a, b) => a + b).toFixed(2))
				: 0;

			const ksmLeft = parseFloat((this.maxKsm - ksmSum).toFixed(2));

			this.ksmSumSubject.next(ksmSum);
			this.ksmLeftSubject.next(ksmLeft);
		});
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
