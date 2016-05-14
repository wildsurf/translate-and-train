/*
 * Angular
 */
import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import { TranslationService } from '../services/TranslationService';

@Component({
  selector: 'translation-lookup',
  providers: [TranslationService],
  template: `
  <h3>Which phrase would you like to learn today?</h3>
  <form class="ui form" [class.loading]="loading">
    <div class="field">
      <label>Choose a phrase</label>
      <input type="text" id="translationSource" #translationSource placeholder="Nice day today">
    </div>
    <button class="ui button" (click)="loadTranslation(translationSource.value)" type="button">Submit</button>
  </form>
  <pre>{{data | json}}</pre>
`
})
export class TranslationLookup {
  data: Object;
  loading: boolean;

  constructor(public http: Http, private translationService: TranslationService) {
  }

  loadTranslation(translationSource:string):void {
    this.translationService.getTranslation(translationSource)
    .subscribe(s => {
      console.log(s);
    });
  }
}

