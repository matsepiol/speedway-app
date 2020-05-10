export interface Game {
	home: string;
	away: string;
}

export interface Options {
	currentRound: number;
	date: string;
	games: Game[];
}
