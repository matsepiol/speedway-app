export enum PlayerType {
	SENIOR = 'Senior',
	OBCOKRAJOWIEC = 'Obcokrajowiec',
	JUNIOR = 'Junior',
}

export interface Player {
	type: PlayerType;
	name?: string;
	ksm?: number[];
	team?: string;
	placeholder?: boolean;
	score?: number;
	bonus?: number;
	ratio?: number;
	szrot?: boolean;
}

export interface PlayerResult {
	name?: string;
	bonus?: number;
	score?: number;
}

export interface Filter {
	team: string[];
	type: string[];
	sort: string;
	searchQuery: string;
	showPossiblePlayers?: boolean;
	showMinimum?: boolean;
	showSzrot?: boolean;
}

export const seniorPlaceholder: Player = {
	type: PlayerType.SENIOR,
	placeholder: true
};

export const obcokrajowiecPlaceholder: Player = {
	type: PlayerType.OBCOKRAJOWIEC,
	placeholder: true
};

export const juniorPlaceholder: Player = {
	type: PlayerType.JUNIOR,
	placeholder: true
};

export const teamPlaceholder: Player[] = [
	seniorPlaceholder,
	obcokrajowiecPlaceholder,
	obcokrajowiecPlaceholder,
	obcokrajowiecPlaceholder,
	seniorPlaceholder,
	juniorPlaceholder,
	juniorPlaceholder
];
