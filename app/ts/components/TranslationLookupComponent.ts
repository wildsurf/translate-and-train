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
  selector: 'google-that',
  inputs: ['searchterm', 'result'],
  template: `
    <a [class.hidden]="isNoSearchTerm()" class="ui icon basic labeled right floated button"
       href="http://www.google.com/search?q={{searchterm}}"
       target="_blank"><i class="google icon"></i> That doesn't sound right? Google it!</a>
    <div class="ui hidden divider"></div>
  `
})
export class GoogleThat {
  searchterm: string;
  result: string;

  public isNoSearchTerm(): boolean {
    return !this.searchterm || !this.result;
  }
}


@Component({
  selector: 'translation-lookup',
  providers: [TranslationService],
  directives: [GoogleThat],
  template: `
  <h2 class="ui red image header">Which new phrase would you like to learn?</h2>
  <form class="ui large form">
  <div class="ui success content message" [class.hidden]="!success">
    <i class="close icon" (click)="dismiss()"></i>
    <div class="header">
      Success!
    </div>
    <p>You have saved the phrase and translation.</p>
  </div>
    <div class="field">
      <div class="ui raised segment left aligned">
        <label class="ui black ribbon label"><i class="es flag"></i> Phrase in Spanish</label>
        <input type="text"
                id="translationSource"
                [ngFormControl]="translationSource"
                autofocus
                required
                placeholder="Hasta la vista">
      </div>
      <div class="ui raised segment left aligned">
      <label class="ui black ribbon label"><i class="gb flag"></i> Phrase in English</label>
      <input [class.loading]="loading" type="text"
              id="translationResult"
              placeholder=""
              [(ngModel)]="translationResult">
      <google-that [searchterm]="translationSource.value"
        [result]="translationResult"></google-that>
      </div>
    </div>
    <button class="ui red button" [class.loading]="posting"
        type="button" (click)="submitForm()">Save phrase and translation</button>
  </form>
  <div class="ui middle aligned center aligned grid">
    <a class="column" href="http://translate.yandex.com/" target="_blank">Powered by Yandex.Translate</a>
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
             .distinctUntilChanged()
             .subscribe((term: string) => this.loadTranslation(term));
  }

  loadTranslation(translationSource: string): void {
    if (!this.translationSource.valid) {
      return;
    }

    this.loading = true;
    this.success = false;

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
     ));

     this.posting = false;
     this.success = true;
     this.translationResult = '';
     this.translationSource.updateValue('');
  }

  dismiss(): void {
    this.success = false;
  }
}
