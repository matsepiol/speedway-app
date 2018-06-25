import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResultsRoutingModule } from '@app/results/results-routing.module';
import { SharedModule } from '@app/shared';
import { MatButtonModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

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
    MatDividerModule
  ],
  declarations: [
    ResultsComponent,
  ],
  providers: [
  ]
})
export class ResultsModule { }
