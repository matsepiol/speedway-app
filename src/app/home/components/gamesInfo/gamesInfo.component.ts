import { Component } from '@angular/core';
import { DataService } from '@app/home/services/data.service';

@Component({
	selector: 'app-games-info',
	templateUrl: './gamesInfo.component.html',
	styleUrls: ['./gamesInfo.component.scss'],
})

export class GamesInfoComponent {
	public loadingMessage = 'Wczytywanie...';  

	constructor(public dataService: DataService) { }
}
