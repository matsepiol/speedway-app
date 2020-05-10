import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlayerManagementRoutingModule } from '@app/playerManagement/playerManagement-routing.module';
import { SharedModule } from '@app/shared';

import { PlayerManagementComponent } from './playerManagement.component';
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
		PlayerManagementRoutingModule,
		SharedModule
	],
	declarations: [
		PlayerManagementComponent,
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
export class PlayerManagementModule { }
