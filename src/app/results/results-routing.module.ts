import { NgModule } from '@angular/core';
import { Route } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultsComponent } from './results.component';

const routes: Routes = [
  Route.withShell([
    { path: 'results', component: ResultsComponent, canActivate: [], data: { title: 'Wyniki' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ResultsRoutingModule { }
