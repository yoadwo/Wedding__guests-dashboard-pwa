import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { guestEM, guestRM, guestsResponse } from 'src/app/models/guest';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class GuestsService {

  constructor(private http: HttpClient) { }

  getGuestsInfo(): Observable<guestEM[]> {
    // httpOptions
    return this.http.get<guestsResponse>(environment.getGuestsInfo + '/get-guests-info')
    .pipe(
      map((resp: guestsResponse) => resp.data)
    );
  }

  sendGuestsText(guestsTextParams: guestRM[]) {
    return this.http.post<guestRM[]>(environment.textGuests + '/text-guests',guestsTextParams);
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     console.error(
  //       `Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError(() => new Error('Something bad happened; please try again later.'));
  // }
}
