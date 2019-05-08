import { Pipe, PipeTransform } from '@angular/core';
import { countBy, orderBy } from 'lodash';
import { Filter, PlayerType, Player } from '../../home/home.model';
import { DataService } from '../../home/services/data.service';
import { combineLatest } from 'rxjs';

@Pipe({
	name: 'filter',
	pure: false
})

export class FilterPipe implements PipeTransform {
	private currentRound: number;

	constructor(private dataService: DataService) {
		this.dataService.getOptions().subscribe(options => {
			this.currentRound = options.currentRound;
		});
	}

	transform(items: Player[], term: Filter): Player[] {
		let tempItems = items;

			if (term.showPossiblePlayers) {
				combineLatest(this.dataService.getSelection(), this.dataService.getKsmLeft())
					.subscribe(([selected, ksmLeft]) => {
						const selection = countBy(selected.filter((item) => !item.placeholder), 'type');

						selection.Obcokrajowiec = selection.Obcokrajowiec || 0;
						selection.Senior = selection.Senior || 0;
						selection.Junior = selection.Junior || 0;

						if (selection.Obcokrajowiec === 3) {
							tempItems = tempItems.filter(player => PlayerType.OBCOKRAJOWIEC.indexOf(player.type) === -1);
						}

						if (selection.Obcokrajowiec + selection.Senior >= 5) {
							tempItems = tempItems.filter(player => PlayerType.SENIOR.indexOf(player.type) === -1);
							tempItems = tempItems.filter(player => PlayerType.OBCOKRAJOWIEC.indexOf(player.type) === -1);
						}

						if (selection.Obcokrajowiec + selection.Senior + selection.Junior >= 7) {
							tempItems = tempItems.filter(player => PlayerType.JUNIOR.indexOf(player.type) === -1);
						}

						tempItems = tempItems.filter(player => player.ksm && player.ksm[this.currentRound - 1] <= ksmLeft);
					});
			}

			if (term.searchQuery.length) {
				tempItems = tempItems.filter(player => player.name.toLowerCase().includes(term.searchQuery.toLowerCase()));
			}

			if (term.team.length) {
				tempItems = tempItems.filter(player => term.team.indexOf(player.team) >= 0);
			}

			if (term.type.length) {
				tempItems = tempItems.filter(player => term.type.indexOf(player.type) >= 0);
			}

			if (term.sort === 'team') {
				tempItems = orderBy(tempItems, ['team', 'ksm'], ['asc', 'desc']);
			}

			if (term.sort === 'ksm') {
				if (tempItems) {
					tempItems.sort((a, b) => b.ksm[this.currentRound - 1] - a.ksm[this.currentRound - 1]);
				}
			}

		return tempItems;
	}
}
