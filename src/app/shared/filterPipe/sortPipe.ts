import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';
import { Player } from '@app/home/home.model';

@Pipe({
	name: 'sortPlayers',
	pure: false
})

export class SortPlayersPipe implements PipeTransform {
	constructor() { }

	transform(items: Player[]): Player[] {
		items = orderBy(items, ['scoreSum', 'bonusSum'], ['desc', 'desc']);

		return items;
	}
}
