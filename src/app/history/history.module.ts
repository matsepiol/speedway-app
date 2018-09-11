import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule, MatSelectModule, MatSortModule, MatTableModule,
    MatTabsModule
} from '@angular/material';
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
