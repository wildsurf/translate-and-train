import {Injectable, provide} from '@angular/core';
import { AngularFire, FirebaseAuth, FirebaseAuthState,
  AuthProviders, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {
  public session: FirebaseAuthState;

  constructor(private firebase: AngularFire, private auth: FirebaseAuth) {
    this.auth.subscribe((authState: FirebaseAuthState) => this.session = authState);
  }

  loginWithTwitter(): void {
    this.auth.login();
  }

  logout(): any {
    this.auth.logout();
  }

  getUser(): any {
    return this.session;
  }

  isLoggedIn(): boolean {
    return !!this.session;
  }

  overrideLogin(): void {
      this.auth.login({
        provider: AuthProviders.Anonymous,
        method: AuthMethods.Anonymous
      });
   }
}

export var AUTH_PROVIDERS: Array<any> = [
  provide(AuthService, {useClass: AuthService})
];
