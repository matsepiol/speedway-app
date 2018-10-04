import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { Users } from '@app/users.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { TableData } from '@app/scores/scores.model';

@Component({
  selector: 'app-table-score',
  templateUrl: './tableScore.component.html',
  styleUrls: ['./tableScore.component.scss']
})
export class TableScoreComponent implements OnChanges {
  public users = Users;
  displayedColumns: string[] = ['position', 'userName', 'scoreSum', 'bonusSum'];

  @Input() dataSource: MatTableDataSource<TableData>;
  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}
