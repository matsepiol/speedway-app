import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent {
  @Input() home: string;
  @Input() away: string;

  public teamMapping = {
    'Toruń': 'Get Well Toruń',
    'Zielona Góra': 'Falubaz Zielona Góra',
    'Wrocław': 'Betard Sparta Wrocław',
    'Tarnów': 'Grupa Azoty Unia Tarnów',
    'Gorzów': 'Cash Broker Stal Gorzów',
    'Grudziądz': 'MRGARDEN GKM Grudziądz',
    'Częstochowa': 'forBET Włókniarz Częstochowa',
    'Leszno': 'Fogo Unia Leszno'
  };

}
