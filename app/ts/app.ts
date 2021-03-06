/*
 * Angular
 */
import {
  Component, provide
} from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { FIREBASE_PROVIDERS, defaultFirebase, firebaseAuthConfig,
  AuthProviders,
  AuthMethods } from 'angularfire2';

import {AUTH_PROVIDERS} from 'services/AuthService';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  Router,
  RouteConfig
} from '@angular/router-deprecated';
/*
 * Components
 */
import { LoginComponent } from 'components/LoginComponent';
import { TranslationLookup } from 'components/TranslationLookupComponent';
import { PracticeComponent } from 'components/PracticeComponent';
import { AboutComponent } from 'components/AboutComponent';

/*
 * Webpack
 */
require('css/styles.scss');

@Component({
  selector: 'http-app',
  directives: [
    TranslationLookup,
    PracticeComponent,
    AboutComponent,
    LoginComponent,
    ROUTER_DIRECTIVES
  ],
  template: `
  <header class="page-header">

      <div class="ui tabular menu">
        <a class="item" [class.active]="isActive(['Practice'])" [routerLink]="['/Practice']">Practice</a>
        <a class="item" [class.active]="isActive(['Translations'])" [routerLink]="['/Translations']">Translations</a>
        <a class="item" [class.active]="isActive(['About'])" [routerLink]="['/About']">About</a>
        <div class="item floated right"><login></login></div>
      </div>


  </header>
      <div class="container">
    <div class="column">
    <router-outlet></router-outlet>
    </div>
    </div>
  `
})
@RouteConfig([
  { path: '/',          name: 'root',      redirectTo: ['Practice'] },
  { path: '/practice',  name: 'Practice',  component: PracticeComponent },
  { path: '/translation',  name: 'Translations', component: TranslationLookup },
  { path: '/about',   name: 'About',   component: AboutComponent }
])
class HttpApp {
  constructor(public router: Router) {
  }

  isActive(instruction: any[]): boolean {
      return this.router.isRouteActive(this.router.generate(instruction));
  }
}

bootstrap(HttpApp, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  FIREBASE_PROVIDERS,
  AUTH_PROVIDERS,
  defaultFirebase('https://glowing-fire-5037.firebaseio.com/'),
  firebaseAuthConfig({
    provider: AuthProviders.Twitter,
    method: AuthMethods.Popup
  }),
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
