import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss']
})

export class GameComponent {
	@Input() home: string;
	@Input() away: string;

	public teamMapping = {
		'Toruń': 'eWinner Apator Toruń',
		'Zielona Góra': 'Falubaz Zielona Góra',
		'Wrocław': 'Betard Sparta Wrocław',
		'Lublin': 'Speed Car Motor Lublin',
		'Gorzów': 'Truly.Work Stal Gorzów',
		'Grudziądz': 'MRGARDEN GKM Grudziądz',
		'Częstochowa': 'forBET Włókniarz Częstochowa',
		'Leszno': 'Fogo Unia Leszno'
	};

}
