/*
 * Angular
 */
import {Component} from '@angular/core';
import {Http} from '@angular/http';
import { TranslationService } from '../services/TranslationService';

@Component({
  selector: 'translation-lookup',
  providers: [TranslationService],
  template: `
  <h2 class="ui red image header">Which phrase would you like to learn today?</h2>
  <form class="ui large form" [class.loading]="loading">
    <div class="field">
      <div class="ui raised segment left aligned">
        <label class="ui red ribbon label">Phrase in English</label>
        <input type="text"
                id="translationSource"
                #translationSource
                placeholder="Nice day today">
      </div>
      <div class="ui raised segment left aligned">
      <label class="ui red ribbon label">Phrase in Spanish</label>
      <input type="text"
              id="translationResult"
              [(ngModel)]="translationResult">
      </div>
    </div>
    <button class="ui red button"
        (click)="loadTranslation(translationSource.value)"
        type="button">Submit</button>
  </form>
`
})
export class TranslationLookup {
  translationSource: string;
  translationResult: string;
  loading: boolean;

  constructor(public http: Http,
              private translationService: TranslationService) {
  }

  loadTranslation(translationSource: string): void {
    this.loading = true;

    this.translationService.getTranslation(translationSource)
      .map((results: string[]) => results.join(', '))
      .subscribe((result: string) => {
        this.translationResult = result;
        this.loading = false;
      });
  }
}
