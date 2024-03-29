import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackBarService } from '../home/services/snack-bar.service';
import { MatInputModule } from '@angular/material/input';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		CommonModule,
		ReactiveFormsModule,

		NgbModule,
		LoginRoutingModule,
		MatSnackBarModule,
		MatInputModule
	],
	declarations: [
		LoginComponent
	],
	providers: [SnackBarService]
})
export class LoginModule { }
