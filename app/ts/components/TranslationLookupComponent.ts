/*
 * Angular
 */
import { Component } from '@angular/core';
import { Control } from '@angular/common';
import { Http } from '@angular/http';
import { TranslationService } from '../services/TranslationService';

export class TranslationPair {
  phrase: string;
  translation: string;

  constructor(newPhrase: string, newTranslation: string) {
    this.phrase = newPhrase;
    this.translation = newTranslation;
  }
}

@Component({
  selector: 'translation-lookup',
  providers: [TranslationService],
  template: `
  <h2 class="ui red image header">Which phrase would you like to learn today?</h2>
  <form class="ui large form">
  <div class="ui teal content message" [class.hidden]="!success">
    <i class="close icon" (click)="dismiss()"></i>
    <div class="header">
      Success!
    </div>
    <p>You have saved the phrase and translation.</p>
  </div>
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
    <button class="ui red button" [class.loading]="posting"
        type="button" (click)="submitForm()">Save phrase and translation</button>
  </form>
  <div style="background:white;padding:10px 0">
    <ul *ngFor="let translation of translationService.translations | async">
      <li class="text">
      {{translation.phrase}} -
        {{translation.translation}}
      </li>
    </ul>
  </div>
`
})
export class TranslationLookup {
  translationSource: Control = new Control();
  translationResult: string;
  success: boolean;
  loading: boolean;
  posting: boolean;

  constructor(public http: Http,
              private translationService: TranslationService) {
      this.translationSource.valueChanges
             .debounceTime(400)
             .subscribe((term: string) => this.loadTranslation(term));
  }

  loadTranslation(translationSource: string): void {
    this.loading = true;

    this.translationService.getTranslation(translationSource)
      .map((results: string[]) => results.join(', '))
      .subscribe((term: string) => {
        this.translationResult = term;
        this.loading = false;
      });
  }

  submitForm(): void {
     this.success = false;
     this.posting = true;

     this.translationService.saveTranslationPair(new TranslationPair(
       this.translationSource.value,
       this.translationResult
     ))
     .catch((error: string) => console.log(error))
     .then(() => {
       this.success = true;
       this.posting = false;
     });
  }

  dismiss(): void {
    this.success = false;
  }
}
