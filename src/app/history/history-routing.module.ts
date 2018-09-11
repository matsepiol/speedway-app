import { NgModule } from '@angular/core';
import { Route } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryComponent } from './history.component';

const routes: Routes = [
  Route.withShell([
    { path: 'history', component: HistoryComponent, canActivate: [], data: { title: 'Historia' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HistoryRoutingModule { }
