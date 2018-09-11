import { Component, Input, ViewChild, OnChanges, SimpleChange } from '@angular/core';
import { Users } from '@app/users.model';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-table-score',
  templateUrl: './tableScore.component.html',
  styleUrls: ['./tableScore.component.scss']
})
export class TableScoreComponent implements OnChanges {
  public users = Users;
  displayedColumns: string[] = ['position', 'userName', 'scoreSum', 'bonusSum'];

  @Input() dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}
