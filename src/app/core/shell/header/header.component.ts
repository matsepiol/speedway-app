import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;

  constructor(
    public authenticationService: AuthenticationService,
  ) { }

  ngOnInit() { }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }


  logout() {
    this.authenticationService.logout();
  }

  get username(): string | null {
    return this.authenticationService.userDetails ? this.authenticationService.userDetails.displayName : null;
  }

}
