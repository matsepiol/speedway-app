import { NgModule } from '@angular/core';
import { Route } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerManagmentComponent } from './playerManagment.component';
import { PlayerManagmentGuard } from './playerManagment.guard';

const routes: Routes = [
	Route.withShell([
		{
			path: 'player-managment',
			component: PlayerManagmentComponent,
			canActivate: [PlayerManagmentGuard],
			data: { title: 'Zarządzanie zawodnikami' }
		}
	])
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: []
})
export class PlayerManagmentRoutingModule { }
