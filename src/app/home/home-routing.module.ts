import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { Route } from '@app/core';
import { HomeComponent } from './home.component';
import { HomeGuard } from './home.guard';

const routes: Routes = [
	Route.withShell([
		{ path: '', component: HomeComponent, canActivate: [HomeGuard], data: { title: 'Wybór składu' } }
	])
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: []
})
export class HomeRoutingModule { }
