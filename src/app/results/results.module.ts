import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResultsRoutingModule } from '@app/results/results-routing.module';
import { SharedModule } from '@app/shared';

import { ResultsComponent } from './results.component';

@NgModule({
	imports: [
		CommonModule,
		ResultsRoutingModule,
		SharedModule,
		FormsModule,
		MatButtonModule,
		MatSelectModule,
		MatExpansionModule,
		MatDividerModule,
		MatTabsModule,
		MatTableModule,
		MatSortModule,
	],
	declarations: [
		ResultsComponent,
	],
	providers: [
	]
})
export class ResultsModule { }
