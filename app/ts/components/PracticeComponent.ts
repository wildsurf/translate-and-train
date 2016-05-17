/*
 * Angular
 */
import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../services/TranslationService';
import { TranslationPair } from './TranslationLookupComponent';
import { Control } from '@angular/common';
import {
  RouterLink
} from '@angular/router-deprecated';

@Component({
  providers: [TranslationService],
  directives: [RouterLink],
  template: `
    <h2 class="ui red image header">Do you remember this phrase?</h2>
    <div class="ui info content message" [class.hidden]="currentTranslation || loading">
      <div class="header">
        No phrases found.
      </div>
      <p>There are no translations in your list.
      Try to <a [routerLink]="['/Translations']">add some.</a></p>
    </div>
    <form class="ui large form" *ngIf="currentTranslation" (submit)="submitForm()">
    <div class="ui success content message" [class.visible]="success">
      <i class="close icon" (click)="dismiss('success')"></i>
      <div class="header">
        Success!
      </div>
      <p>You have entered the correct translation!</p>
    </div>
    <div class="ui error content message" *ngIf="currentTranslation" [class.visible]="error">
      <i class="close icon" (click)="dismiss('error')"></i>
      <div class="header">
        Not quite!
      </div>
      <p>The phrase is: <strong>{{currentTranslation.translation}}</strong></p>
    </div>
      <div class="field" [class.loading]="loading">
        <div class="ui raised segment left aligned">
          <div class="ui info content message">
              <i class="es flag"></i>
              {{currentTranslation.phrase}}
          </div>
        </div>
        <div class="ui raised segment left aligned">
        <label class="ui black ribbon label"><i class="gb flag"></i> Phrase in English</label>
        <input type="text"
                id="translation"
                autofocus
                [ngFormControl]="translation">
        </div>
      </div>
      <button *ngIf="!error && !success"
          id="check-button"
          class="ui red button"
          type="submit">Check your translation</button>
      <button *ngIf="error || success"
          id="next-button"
          class="ui teal button"
          type="button" (click)="dismiss()">Next translation</button>
    </form>
  `
})
export class PracticeComponent implements OnInit {
  success: boolean;
  error: boolean;
  loading: boolean;
  translation: Control = new Control();
  currentTranslation: TranslationPair;

  constructor(private translationService: TranslationService) {
    this.success = false;
    this.error = false;
  }

  ngOnInit(): void {
     this.loading = true;
     this.pickNewTranslationPair();
  }

  submitForm(): boolean {
    if (!this.translation) {
      return;
    }

    if (this.translation.value === this.currentTranslation.translation) {
      this.success = true;
    } else {
      this.error = true;
    }

    setTimeout(() => document.getElementById('next-button').focus(), 0);
    return false;
  }

  pickNewTranslationPair(): void {
    let translationRef: any = this.translationService.translations._ref.ref();

    translationRef.once('value', (snapshot: any) => {
        let i: number = 0;
        let rand: number = Math.floor(Math.random() * snapshot.numChildren());

        snapshot.forEach((child: any) => {
          if (i === rand) {
            this.currentTranslation = child.val();
          }
          i++;
        });
        this.loading = false;
    });

  }

  resetInputs(): void {
    this.translation.updateValue('');
    document.getElementById('translation').focus();
  }

  dismiss(window: string): void {
    this.success = false;
    this.error = false;

    this.resetInputs();
    this.pickNewTranslationPair();
  }
}
