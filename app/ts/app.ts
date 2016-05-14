/*
 * Angular
 */
import {
  Component
} from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

/*
 * Components
 */
import { TranslationLookup } from 'components/TranslationLookupComponent';

/*
 * Webpack
 */
require('css/styles.scss');

@Component({
  selector: 'http-app',
  directives: [
    TranslationLookup
  ],
  template: `
    <div class="column">
    <translation-lookup></translation-lookup>
    </div>
  `
})
class HttpApp {
}

bootstrap(HttpApp, [
  HTTP_PROVIDERS
]);
