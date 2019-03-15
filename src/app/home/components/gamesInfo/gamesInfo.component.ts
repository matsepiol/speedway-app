import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/home/services/data.service';
import { Options } from '@app/playerManagment/playerManagment.model';

@Component({
	selector: 'app-games-info',
	templateUrl: './gamesInfo.component.html',
	styleUrls: ['./gamesInfo.component.scss'],
})

export class GamesInfoComponent implements OnInit{
	public options: Options;
	public isLoading: Boolean;
	public loadingMessage = 'Wczytywanie...';

	constructor(public dataService: DataService) { }

	public ngOnInit() {
		this.isLoading = true;		 
		this.dataService.getOptions().subscribe(options => {
			this.isLoading = false;
			this.options = options;
		});
	}
}
