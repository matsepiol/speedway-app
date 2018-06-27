import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../../home/services/data.service';
import { orderBy } from 'lodash';
import { Users } from '@app/users.model';

@Pipe({
  name: 'sortPlayers',
  pure: false
})

export class SortPlayersPipe implements PipeTransform {
  constructor(private dataService: DataService) { }

  transform(items: any[]): any {
    items = orderBy(items, ['scoreSum', 'bonusSum'], ['desc', 'desc']);

    return items;
  }
}
