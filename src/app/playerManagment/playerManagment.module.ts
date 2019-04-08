import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatSelectModule,
	MatDialogModule,
	MatCheckboxModule,
	MatTabsModule,
	MatDatepickerModule,
	MatNativeDateModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlayerManagmentRoutingModule } from '@app/playerManagment/playerManagment-routing.module';
import { SharedModule } from '@app/shared';

import { PlayerManagmentComponent } from './playerManagment.component';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { EditPlayerDialogComponent } from './editPlayerDialog/editPlayer-dialog.component';
import {
	GenericConfirmationDialogComponent
} from '@app/shared/genericConfirmationDialog/generic-confirmation-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatDividerModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatInputModule,
		MatSelectModule,
		MatTabsModule,
		MatDialogModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		PlayerManagmentRoutingModule,
		SharedModule
	],
	declarations: [
		PlayerManagmentComponent,
		EditPlayerDialogComponent,
	],
	entryComponents: [
		EditPlayerDialogComponent,
		GenericConfirmationDialogComponent,
	],
	providers: [
		AuthenticationService
	]
})
export class PlayerManagmentModule { }
