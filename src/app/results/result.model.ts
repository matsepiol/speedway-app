import { PlayerResult } from '@app/home/home.model';

export interface TableData {
	userName: string;
	scoreSum: number;
	bonusSum: number;
}

export interface UserResult {
	name: string;
	scoreSum: number;
	bonusSum: number;
}

export interface Squad {
	userId: string;
	team: string[];
	results: PlayerResult[];
	scoreSum?: number;
	bonusSum?: number;
}

export interface StatsData {
	type: string;
	team?: string;
	score?: number;
	bonus?: number;
	ratio?: number;
}
