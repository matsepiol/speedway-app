import { Component, Input } from '@angular/core';
import { Users } from '@app/users.model';

@Component({
  selector: 'app-round-score',
  templateUrl: './roundScore.component.html',
  styleUrls: ['./roundScore.component.scss']
})
export class RoundScoreComponent {
  public users = Users;

  @Input() squads: any;

  constructor() { }

}
