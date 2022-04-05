import { Pipe, PipeTransform } from '@angular/core';
import { countBy, orderBy } from 'lodash';
import { Filter, PlayerType, Player } from '../../home/home.model';
import { Store } from '../../home/services/store.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

@Pipe({
	name: 'filter',
	pure: false
})

export class FilterPipe implements PipeTransform {
	constructor(private store: Store) { }

	transform(items: Player[], term: Filter): Player[] {
		let tempItems = items;

		if (term.showPossiblePlayers) {
			combineLatest(
				this.store.selectedPlayers$,
				this.store.ksmLeft$,
				this.store.options$
			).pipe(take(1))
				.subscribe(([selected, ksmLeft, options]) => {
					const selection = countBy(selected.filter((item) => !item.placeholder), 'type');

					selection.Obcokrajowiec = selection.Obcokrajowiec || 0;
					selection.Senior = selection.Senior || 0;
					selection.Junior = selection.Junior || 0;

					const isU24 = !!selected.find(rider => rider.u24 && rider.type !== PlayerType.JUNIOR);

					if (selection.Obcokrajowiec === 2 && !isU24) {
						tempItems = tempItems.filter(player => PlayerType.OBCOKRAJOWIEC.indexOf(player.type) === -1 || player.u24);
					}

					if (selection.Obcokrajowiec === 2 && isU24) {
						tempItems = tempItems.filter(player => PlayerType.OBCOKRAJOWIEC.indexOf(player.type) === -1);
					}

					if (selection.Obcokrajowiec >= 3) {
						tempItems = tempItems.filter(player => PlayerType.OBCOKRAJOWIEC.indexOf(player.type) === -1);
					}

					if (selection.Obcokrajowiec + selection.Senior === 4 && !isU24) {
						tempItems = tempItems.filter(player => player.u24);
					}

					if (selection.Obcokrajowiec + selection.Senior >= 5) {
						tempItems = tempItems.filter(player => PlayerType.SENIOR.indexOf(player.type) === -1);
						tempItems = tempItems.filter(player => PlayerType.OBCOKRAJOWIEC.indexOf(player.type) === -1);
					}

					if (selection.Obcokrajowiec + selection.Senior + selection.Junior >= 7) {
						tempItems = tempItems.filter(player => PlayerType.JUNIOR.indexOf(player.type) === -1);
					}

					tempItems = tempItems.filter(player => player.ksm && player.ksm[options.currentRound - 1] <= ksmLeft);
				});
		}

		if (term.searchQuery.length) {
			tempItems = tempItems.filter(player => player.name.toLowerCase().includes(term.searchQuery.toLowerCase()));
		}

		if (term.team.length) {
			tempItems = tempItems.filter(player => term.team.indexOf(player.team) >= 0);
		}

		if (term.type.length) {
			let typeFilter = [...term.type];
			if (term.type.indexOf('U24') >= 0) {
				tempItems = tempItems.filter(player => player.u24);
			}

			typeFilter = typeFilter.filter(filter => filter !== 'U24');
			if (typeFilter.length) {
				tempItems = tempItems.filter(player => typeFilter.indexOf(player.type) >= 0);
			}
		}

		if (term.sort === 'team') {
			tempItems = orderBy(tempItems, ['team', 'ksm'], ['asc', 'desc']);
		}

		if (term.sort === 'ksm') {
			if (tempItems) {
				this.store.options$.pipe(take(1)).subscribe(options => {
					tempItems.sort((a, b) => b.ksm[options.currentRound - 1] - a.ksm[options.currentRound - 1]);
				});
			}

		}

		return tempItems;
	}
}
