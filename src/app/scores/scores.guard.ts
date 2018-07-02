import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../authentication/authentication.service';


@Injectable()
export class ScoresGuard implements CanActivate {

  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

  canActivate() {
    if (this.authenticationService.isAdmin()) {
      return true;
    }

    this.router.navigate(['']);
    return false;
  }

}
