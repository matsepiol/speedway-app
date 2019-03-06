import { Component, OnInit } from '@angular/core';
import { DataService } from '../home/services/data.service';
import { Users } from '@app/users.model';
import { find, orderBy, remove } from 'lodash';
import { MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { Squad, StatsData } from './result.model';
import { Player, PlayerResult } from '../home/home.model';
import { TableData } from '@app/scores/scores.model';
import { combineLatest } from 'rxjs';
import { CURRENT_ROUND, ROUNDS_ITERABLE } from '@app/variables';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
	public currentRound = CURRENT_ROUND;
	public currentStatsRound = this.currentRound;
	public isLoading = false;
	public isUserSquadSent: boolean;
	public loadingMessage = 'Wczytywanie...';
	public roundsIterable = ROUNDS_ITERABLE;
	public squads: Squad[] = [];
	public users = Users;
	public tableData: TableData[] = [];
	public dataSource: MatTableDataSource<TableData>;
	public statsData: StatsData[] = [];
	public statsTableData: MatTableDataSource<StatsData>;

	displayedStatsColumns: string[] = ['position', 'name', 'score', 'ksm', 'ratio'];

	constructor(
		public dataService: DataService,
	) {
	}

	public ngOnInit(): void {
		this.fetchRoundSquad();
	}

	private fetchRoundSquad(): void {
		this.isLoading = true;
		this.squads = [];

		this.dataService.getRoundSquads(
			this.currentRound,
			JSON.parse(localStorage.getItem('currentUser')).user.uid
		).subscribe((team: string[]) => {
			this.isUserSquadSent = !!team.length;
		});

		Object.keys(Users).forEach((userId: string) => {
			combineLatest(
				this.dataService.getRoundSquads(this.currentRound, userId),
				this.dataService.getRoundScore(this.currentRound)
			).subscribe(
				([team, scores]) => {
					const playerSquad = find(this.squads, squad => squad.userId === userId);
					if (!playerSquad) {
						this.squads.push({ userId, team, results: [] });
					} else if (!playerSquad.team.length && team.length === 7) {
						remove(this.squads, squad => squad.userId === userId);
						this.squads.unshift({ userId, team, results: [] });
					}

					this.squads.forEach((squad) => {
						squad.results = [];
						squad.scoreSum = 0;
						squad.bonusSum = 0;
						squad.team.forEach((player: string) => {
							let playerScore: PlayerResult = find(scores, { 'name': player });

							if (!playerScore) {
								playerScore = {
									name: player,
									score: 0,
									bonus: 0
								};
							}
							squad.scoreSum += playerScore ? playerScore.score : 0;
							squad.bonusSum += playerScore ? playerScore.bonus : 0;
							squad.results.push(playerScore);
						});

						if (squad.scoreSum) {
							this.dataService.setRoundResult(squad.userId, this.currentRound, [squad.scoreSum, squad.bonusSum]);
						}
					});

					this.isLoading = false;
				}
			);
		});
	}

	public fetchStatsData(): void {
		this.isLoading = true;
		this.statsData = [];

		this.dataService.getData().subscribe((players: Player[]) => {
			this.dataService.getRoundScore(this.currentStatsRound).subscribe((scores: PlayerResult[]) => {
				if (scores.length) {
					players.forEach((player) => {
						const playerScore = find(scores, { 'name': player.name });
						player.score = playerScore.score;
						player.ratio = parseFloat((player.score / player.ksm).toFixed(2));
						this.statsData.push(player);
					});
				}

				this.statsData = orderBy(this.statsData, ['ratio'], ['desc']).filter(player => player.score);
				this.statsTableData = new MatTableDataSource(this.statsData);
				this.isLoading = false;
			});
		});
	}

	public onRoundChange(): void {
		this.fetchRoundSquad();
	}

	public onStatsRoundChange(): void {
		this.fetchStatsData();
	}

	public onSelect(event: MatTabChangeEvent): void {
		if (event.tab.textLabel === 'Tabela' && !this.tableData.length) {

			this.isLoading = true;
			Object.keys(Users).forEach((userId) => {
				this.dataService.getRoundResult(userId).subscribe((data) => {
					const userName: string = this.users[userId];
					const playerScore = find(this.tableData, { 'userName': userName });
					if (playerScore) {
						playerScore.scoreSum = data.reduce((a: number, b) => a + parseInt(b[0], 10), 0);
						playerScore.bonusSum = data.reduce((a: number, b) => a + parseInt(b[1], 10), 0);
					} else {
						this.tableData.push({
							userName: this.users[userId],
							scoreSum: data.reduce((a: number, b) => a + parseInt(b[0], 10), 0),
							bonusSum: data.reduce((a: number, b) => a + parseInt(b[1], 10), 0),
						});
					}

					this.dataSource = new MatTableDataSource(this.tableData);
					this.isLoading = false;
				});
			});
		}

		if (event.tab.textLabel === 'Wybory kolejki' && !this.statsData.length) {
			this.fetchStatsData();
		}
	}
}

