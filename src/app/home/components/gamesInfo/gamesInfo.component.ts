import { Component } from '@angular/core';
import { Store } from '@app/home/services/store.service';

@Component({
	selector: 'app-games-info',
	templateUrl: './gamesInfo.component.html',
	styleUrls: ['./gamesInfo.component.scss'],
})

export class GamesInfoComponent {
	public loadingMessage = 'Wczytywanie...';

	constructor(public store: Store) { }
}
