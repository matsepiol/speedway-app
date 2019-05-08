import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatSelectModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScoresRoutingModule } from '@app/scores/scores-routing.module';
import { SharedModule } from '@app/shared';

import { ScoresComponent } from './scores.component';
import { AuthenticationService } from '@app/authentication/authentication.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatDividerModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		ScoresRoutingModule,
		SharedModule
	],
	declarations: [
		ScoresComponent,
	],
	providers: [
		AuthenticationService
	]
})
export class ScoresModule { }
