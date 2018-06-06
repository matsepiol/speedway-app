export enum PlayerType {
  SENIOR = 'Senior',
  ZAGRANICZNY = 'Zagraniczny',
  JUNIOR = 'Junior',
}

export interface Player {
  type: PlayerType;
  name?: string;
  ksm?: number;
  team?: string;
  placeholder?: boolean;
}

export interface Filter {
  team: string[];
  type: string[];
  sort: string;
  searchQuery: string;
}

export const seniorPlaceholder: Player = {
  type: PlayerType.SENIOR,
  placeholder: true
};

export const zagranicznyPlaceholder: Player = {
  type: PlayerType.ZAGRANICZNY,
  placeholder: true
};

export const juniorPlaceholder: Player = {
  type: PlayerType.JUNIOR,
  placeholder: true
};

export const teamPlaceholder: Player[] = [
  seniorPlaceholder,
  zagranicznyPlaceholder,
  zagranicznyPlaceholder,
  zagranicznyPlaceholder,
  seniorPlaceholder,
  juniorPlaceholder,
  juniorPlaceholder
];
