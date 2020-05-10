import { Component, Input, ViewChild, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Users } from '@app/users.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableData } from '@app/scores/scores.model';

@Component({
	selector: 'app-table-score',
	templateUrl: './tableScore.component.html',
	styleUrls: ['./tableScore.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableScoreComponent implements OnChanges {
	public users = Users;
	displayedColumns: string[] = ['position', 'userName', 'scoreSum', 'bonusSum'];

	@Input() dataSource: MatTableDataSource<TableData>;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	ngOnChanges(): void {
		if (this.dataSource) {
			this.dataSource.sort = this.sort;
		}
	}
}
