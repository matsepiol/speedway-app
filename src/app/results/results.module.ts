import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
		MatButtonModule, MatSelectModule, MatSortModule, MatTableModule,
		MatTabsModule
} from '@angular/material';
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
