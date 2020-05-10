import { NgModule } from '@angular/core';
import { Route } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerManagementComponent } from './playerManagement.component';
import { PlayerManagementGuard } from './playerManagement.guard';

const routes: Routes = [
	Route.withShell([
		{
			path: 'player-management',
			component: PlayerManagementComponent,
			canActivate: [PlayerManagementGuard],
			data: { title: 'Zarządzanie zawodnikami' }
		}
	])
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: []
})
export class PlayerManagementRoutingModule { }
