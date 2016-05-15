import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { TranslationPair }     from '../components/TranslationLookupComponent';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class TranslationService {

  public translations: FirebaseListObservable<TranslationPair[]>;
  private translateUrl: string;
  private apiKey: string;

  constructor (private http: Http, private firebase: AngularFire) {
      this.translateUrl =
          'https://translate.yandex.net/api/v1.5/tr.json/translate';
      this.apiKey =
          'trnsl.1.1.20160424T175748Z.b14b726c783491a9.a32ac80420e3535516377dd996efc559e691639f';
      this.translations = this.firebase.list('/translations');
  }

  getTranslation(translationSource: string): Observable<string[]> {
    let urlString: string =
        `${this.translateUrl}?key=${this.apiKey}&text=${translationSource}&lang=es-en`;

    return this.http.request(urlString)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveTranslationPair(translationPair: TranslationPair): void {

    let translationRef: any = this.translations._ref.ref();
    let existingTranslation: any;

    translationRef.once('value', (snapshot: any) => {
        snapshot.forEach((child: any) => {
            if (child.val().phrase === translationPair.phrase) {
                existingTranslation = child;
            }
        });

        if (!existingTranslation) {
          this.translations.push(translationPair);
        } else {
          translationRef.child(existingTranslation.key()).set(translationPair);
        }
    });
  }

  private extractData(res: Response): string[] {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    let body: any = res.json();
    return body.text || [];
  }

  private handleError(error: any): Observable<string[]> {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
