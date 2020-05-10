import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { FilterPipe } from './filterPipe/filterPipe';
import { RoundScoreComponent } from './roundScore/roundScore.component';
import { TableScoreComponent } from './tableScore/tableScore.component';
import { SortPlayersPipe } from '@app/shared/filterPipe/sortPipe';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { GenericConfirmationDialogComponent } from './genericConfirmationDialog/generic-confirmation-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		MatExpansionModule,
		MatDividerModule,
		MatSortModule,
		MatTableModule,
		MatDialogModule,
		MatButtonModule,
		FormsModule,
	],
	declarations: [
		LoaderComponent,
		FilterPipe,
		RoundScoreComponent,
		TableScoreComponent,
		GenericConfirmationDialogComponent,
		SortPlayersPipe
	],
	exports: [
		LoaderComponent,
		FilterPipe,
		RoundScoreComponent,
		TableScoreComponent,
		GenericConfirmationDialogComponent,
		SortPlayersPipe
	]
})
export class SharedModule { }
