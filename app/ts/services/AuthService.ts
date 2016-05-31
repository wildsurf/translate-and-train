import {Injectable, provide} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';
import { AngularFire, FirebaseAuth, FirebaseAuthState,
  AuthProviders, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {
  public session: FirebaseAuthState;
  public author: Subject<string> = new BehaviorSubject<string>(null);

  constructor(private firebase: AngularFire, private auth: FirebaseAuth) {
      this.auth.subscribe((authState: FirebaseAuthState) => {
          this.session = authState;
          this.author.next((authState) ? authState.uid : null);
      });
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
