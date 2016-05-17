/*
 * Angular
 */
import {Component} from '@angular/core';

/*
 * Services
 */
import {AuthService} from '../services/AuthService';

@Component({
  selector: 'login',
  template: `
  <button *ngIf="!authService.isLoggedIn()"
    (click)="login()"
    class="ui twitter tiny button">
    <i class="twitter icon"></i>
    Login with Twitter
  </button>
  <div class="well" *ngIf="authService.isLoggedIn()">
    Logged in as <b>{{ authService.getUser().twitter.displayName}}</b>
    <a href (click)="logout()">Log out</a>
  </div>
  `
})
export class LoginComponent {
  message: string;

  constructor(public authService: AuthService) {
    this.message = '';
  }

  login(): void {
    this.authService.loginWithTwitter();
  }

  logout(): boolean {
    this.authService.logout();

    return false;
  }
}
