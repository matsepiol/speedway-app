export interface Game {
	home: string,
	away: string,
}

export interface Options {
    currentRound: number,
    date: string,
    hour: number,
    minute: number,
    games: Game[]
}