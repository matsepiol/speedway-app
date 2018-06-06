import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { Route } from '@app/core';
import { HomeComponent } from './home.component';

const routes: Routes = [
  Route.withShell([
    { path: '', component: HomeComponent, data: { title: '' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }
