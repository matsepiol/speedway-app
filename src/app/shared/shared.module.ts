import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { FilterPipe } from './filterPipe/filterPipe';
import { SortPlayersPipe } from '@app/shared/filterPipe/sortPipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    LoaderComponent,
    FilterPipe,
    SortPlayersPipe
  ],
  exports: [
    LoaderComponent,
    FilterPipe,
    SortPlayersPipe
  ]
})
export class SharedModule { }
