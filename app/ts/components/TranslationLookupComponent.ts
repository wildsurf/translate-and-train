/*
 * Angular
 */
import { Component } from '@angular/core';
import { Control } from '@angular/common';
import { Http } from '@angular/http';
import { TranslationService } from '../services/TranslationService';

@Component({
  selector: 'translation-lookup',
  providers: [TranslationService],
  template: `
  <h2 class="ui red image header">Which phrase would you like to learn today?</h2>
  <form class="ui large form">
    <div class="field">
      <div class="ui raised segment left aligned">
        <label class="ui teal ribbon label"><i class="gb flag"></i> Phrase in English</label>
        <input type="text"
                id="translationSource"
                [ngFormControl]="translationSource"
                autofocus
                placeholder="Have a nice day">
      </div>
      <div class="ui raised segment left aligned" [class.loading]="loading">
      <label class="ui teal ribbon label"><i class="es flag"></i> Phrase in Spanish</label>
      <input type="text"
              id="translationResult"
              placeholder=""
              [(ngModel)]="translationResult">
      </div>
    </div>
    <button class="ui red button"
        type="button" (click)="submitForm()">Submit</button>
  </form>
`
})
export class TranslationLookup {
  translationSource = new Control();
  translationResult: string;
  loading: boolean;

  constructor(public http: Http,
              private translationService: TranslationService) {
      this.translationSource.valueChanges
             .debounceTime(400)
             .subscribe(term => this.loadTranslation(term));
  }

  private loadTranslation(translationSource: string): void {
    this.loading = true;

    this.translationService.getTranslation(translationSource)
      .map((results: string[]) => results.join(', '))
      .subscribe(term => {
        this.translationResult = term;
        this.loading = false;
      });
  }

  private submitForm() {
     console.log(this.translationSource.value);
     console.log(this.translationResult);
  }
}
