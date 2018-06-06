import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';
import { Filter } from '../../home/home.model';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], term: Filter): any {
      let tempItems = items;

      if (term.searchQuery.length) {
        tempItems = tempItems.filter( (player) => player.name.toLowerCase().includes(term.searchQuery.toLowerCase()));
      }

      if (term.team.length) {
        tempItems = tempItems.filter((player) => term.team.indexOf(player.team) >= 0);
      }

      if (term.type.length) {
        tempItems = tempItems.filter((player) => term.type.indexOf(player.type) >= 0);
      }

      if (term.sort === 'team') {
        tempItems = orderBy(tempItems, ['team', 'ksm'], ['asc', 'desc']);
      }

      if (term.sort === 'ksm') {
        tempItems = orderBy(tempItems, ['ksm', 'team'], ['desc', 'asc']);
      }

      return tempItems;
    }
}
