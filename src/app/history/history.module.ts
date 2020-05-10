import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { HistoryRoutingModule } from '@app/history/history-routing.module';
import { SharedModule } from '@app/shared';

import { HistoryComponent } from './history.component';

@NgModule({
	imports: [
		CommonModule,
		HistoryRoutingModule,
		SharedModule,
		FormsModule,
		MatButtonModule,
		MatSelectModule,
		MatTabsModule,
		MatTableModule,
		MatSortModule,
	],
	declarations: [
		HistoryComponent,
	],
	providers: [
	]
})
export class HistoryModule { }
