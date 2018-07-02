export interface TableData {
  userName: string;
  scoreSum: number;
  bonusSum: number;
}

export interface PlayerResult {
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
