import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { HomeGuard } from './home/home.guard';
import { AuthenticationService } from './authentication/authentication.service';

import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { ScoresModule } from './scores/scores.module';
import { ResultsModule } from './results/results.module';
import { HistoryModule } from './history/history.module';
import { LoginModule } from './login/login.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ScoresGuard } from '@app/scores/scores.guard';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'speedway-app'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    CoreModule,

    SharedModule,
    HomeModule,
    ScoresModule,
    ResultsModule,
    HistoryModule,
    LoginModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    HomeGuard,
    ScoresGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
