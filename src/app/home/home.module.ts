import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PlayersListComponent } from './components/playersList/playersList.component';
import { MatButtonModule, MatInputModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataService } from './services/data.service';
import { SnackBarService } from './services/snack-bar.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    CoreModule,
    FormsModule,
    HomeRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    HomeComponent,
    PlayersListComponent,
  ],
  providers: [
    DataService,
    SnackBarService,
  ]
})
export class HomeModule { }
