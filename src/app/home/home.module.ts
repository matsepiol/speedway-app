import { ClipboardModule } from 'ngx-clipboard';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared';

import { GameComponent } from './components/gamesInfo/game/game.component';
import { GamesInfoComponent } from './components/gamesInfo/gamesInfo.component';
import { PlayersListComponent } from './components/playersList/playersList.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DataService } from './services/data.service';
import { SnackBarService } from './services/snack-bar.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ClipboardModule,
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    GameComponent,
    GamesInfoComponent,
    HomeComponent,
    PlayersListComponent,
  ],
  providers: [
    DataService,
    SnackBarService,
  ]
})
export class HomeModule { }
