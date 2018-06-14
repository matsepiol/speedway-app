import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationService } from './authentication/authentication.service';

import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'speedway-app'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    CoreModule,

    SharedModule,
    HomeModule,
    AboutModule,
    LoginModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    AuthenticationGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
