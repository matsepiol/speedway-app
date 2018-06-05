import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { FilterPipe } from './filterPipe/filterPipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    LoaderComponent,
    FilterPipe,
  ],
  exports: [
    LoaderComponent,
    FilterPipe,
  ]
})
export class SharedModule { }
