import { NgModule } from '@angular/core';
import { Route } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoresComponent } from './scores.component';
import { ScoresGuard } from './scores.guard';

const routes: Routes = [
  Route.withShell([
    { path: 'scores', component: ScoresComponent, canActivate: [ScoresGuard], data: { title: 'Punktacja' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ScoresRoutingModule { }
