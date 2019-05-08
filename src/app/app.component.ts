import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Store } from './home/services/store.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private titleService: Title,
		private store: Store
	) { }

	ngOnInit() {
		this.store.init();

		const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

		onNavigationEnd
			.pipe(
				map(() => {
					let route = this.activatedRoute;
					while (route.firstChild) {
						route = route.firstChild;
					}
					return route;
				}),
				filter(route => route.outlet === 'primary'),
				mergeMap(route => route.data)
			)
			.subscribe(event => {
				const title = event['title'];
				if (title) {
					this.titleService.setTitle(title);
				}
			});
	}

}
