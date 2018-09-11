import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { FilterPipe } from './filterPipe/filterPipe';
import { RoundScoreComponent } from './roundScore/roundScore.component';
import { TableScoreComponent } from './tableScore/tableScore.component';
import { SortPlayersPipe } from '@app/shared/filterPipe/sortPipe';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule, MatTableModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatDividerModule,
    MatSortModule,
    MatTableModule,
  ],
  declarations: [
    LoaderComponent,
    FilterPipe,
    RoundScoreComponent,
    TableScoreComponent,
    SortPlayersPipe
  ],
  exports: [
    LoaderComponent,
    FilterPipe,
    RoundScoreComponent,
    TableScoreComponent,
    SortPlayersPipe
  ]
})
export class SharedModule { }
