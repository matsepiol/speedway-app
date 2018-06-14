import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@app/login/login.component';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { HomeModule } from '@app/home/home.module';

const routes: Routes = [
  { path: '**', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomeModule, canActivate: [AuthenticationGuard]},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
