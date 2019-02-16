import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {NotificationService} from './notification.service';
import {Doctor} from '../doctor';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {Doctorslots} from '../doctorslots';
import {Slots} from '../slots';

export interface InitResponse {
  token: string;
}

export interface StatusResponse {
  valid: boolean;
  data: {
    authenticated: boolean,
    expires: string;
    _id: string,
    __v: number
  };
}

export interface ErrorResponse {
  valid: boolean;
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Session token
  token = localStorage.getItem('usertoken') || '';
  // Flags
  // user is authenticated
  authenticated = false;
  // has a valid session
  valid = false;
  // initial session-clearing has finished
  ready = false;
  parts: string[];
  parts2: string[];
  parts3: string[];

  // stores data of current session
  session_data: any;

  // stores date of this user
  user: any;
  // subject to notify components when DataService becomes ready
  readySubject = new BehaviorSubject(false);
  authSubject = new BehaviorSubject(false);
  userSubject = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router, private Notificator: NotificationService,
              private messageService: MessageService) {
  }

  readonly API_URL = 'https://api.bookyourdoc.tk';

  init() {
    console.log('Initialize DataService');
    this.getToken().then((res) => {
      console.log('Token received: ' + this.token);
    })
      .then(() => this.getSessionStatus()).then((res) => {
      console.log(res);
    }).catch((e) => {
      console.error('Error: ' + e);
      this.Notificator.showmessage('Init Error' + e);
    });
  }

  getToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if token is existing and long enough
      if (this.token && this.token.length > 10) {
        // Verify token
        this.http.get<any>(this.API_URL + '/status').subscribe(data => {
            if (data.valid && data.valid === true) {
              // Token is valid
              resolve();
            } else {
              resolve(this.getTokenHTTP());
            }
          }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              this.Notificator.showmessage('Client-side error occurred' + err.message);
              reject('Client-side error occurred: ' + err.message);
            } else {
              this.Notificator.showmessage('Server-side error occurred' + err.message);
              reject('Server-side error occurred.');
            }
          }
        );
      } else {
        resolve(this.getTokenHTTP());
      }
    });
  }

  getTokenHTTP(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.API_URL + '/init').subscribe(data => {
          if (data.token) {
            this.token = data.token;
            localStorage.setItem('usertoken', data.token);
            resolve();
          } else {
            reject();
          }

        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.Notificator.showmessage('Client-side error occurred' + err.message);
            reject('Client-side error occurred: ' + err.message);
          } else {
            this.Notificator.showmessage('Server-side error occurred' + err.message);
            reject('Server-side error occurred.');
          }
        }
      );
    });
  }

  getSessionStatus(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(this.API_URL + '/status').subscribe(data => {
        if (data.valid && data.valid === true && data.data) {
          // Token and Session are valid, continue with setting flags
          this.valid = true;
          this.ready = true;
          this.session_data = data.data;
          if (this.session_data.authenticated && (this.session_data.authenticated === true)) {
            console.log('User is authenticated');
            this.authenticated = true;
            this.authSubject.next(true);
          } else {
            this.authSubject.next(false);
            this.authenticated = false;
          }
          // Get user details
          if ( this.authenticated === true) {
            this.getUserDetails().then(() => {
              // Publishing state change
              this.readySubject.next(true);
              resolve(this.session_data);
            });
          } else {
            // Publishing state change
            this.readySubject.next(true);
            this.userSubject.next(false);
            resolve(this.session_data);
          }

        } else {
          this.Notificator.showmessage('Fatal error: invalid token received, not recoverable');
          reject('Fatal error: invalid token received, not recoverable');
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.Notificator.showmessage('Client-side error occurred' + err.message);
          reject('Client-side error occurred: ' + err.message);
        } else {
          this.Notificator.showmessage('Server-side error occurred' + err.message);
          reject('Server-side error occurred.');
        }
      });
    });
  }

  getUserDetails() {
    return new Promise((resolve, reject) => {
    this.authSubject.subscribe({
      next: (v) => {
        if (v === true) {
          this.http.get<any>(this.API_URL + '/user').subscribe(data => {
            if (data) {
              this.user = data;
              this.userSubject.next(true);
            } else {
              this.userSubject.next(false);
            }
            resolve();
          });
        }
      }
    });
    });
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.API_URL + '/doctors')
      .pipe(
        // tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getDoctors', []))
      );
  }

  getDoctors2(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.API_URL + '/doctors/my')
      .pipe(
        // tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getDoctors', []))
      );
  }

  getTimeSlots(id: string): Observable<Doctorslots> {
    return this.http.get<Doctorslots>(this.API_URL + '/doctor/' + id)
      .pipe(
      );
  }

  getSlots(): Observable<Slots[]> {
    return this.http.get<Slots[]>(this.API_URL + '/slots')
      .pipe(
        // tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getSlots', []))
      );
  }

  getSlotsDoctor(id: string): Observable<Slots[]> {
    return this.http.get<Slots[]>(this.API_URL + '/slots/' + id)
      .pipe(
        // tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getSlots', []))
      );
  }

  registerSlot(docid: string, start: string, end: string): void {
    const req = this.http.post(this.API_URL + '/slot', {
      docid: docid,
      start: start,
      end: end,
    })
      .subscribe(
        res => {
          console.log(res);
        },
        (err: HttpErrorResponse) => {
          // this.Notificator.showmessage('Error' + err.message);
          if (err instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', err.error.error);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${err.status}, ` +
              `body was: ${err.message}`);
          }
          // return an observable with a user-facing error message
          return throwError(
            'Something bad happened; please try again later.');
          console.log('Error occured');
        }
      );
    console.log('this is req' + req);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // private log(message: string) {
  // this.messageService.add(`HeroService: ${message}`);
  // }

  registerUser(type: string, gender: string, first_name: string, last_name: string, mail: string, password: string): void {
    if (this.authenticated === false) {
      const req = this.http.post(this.API_URL + '/register', {
        type: type,
        gender: gender,
        first_name: first_name,
        last_name: last_name,
        mail: mail,
        password: password
      })
        .subscribe(
          res => {
            console.log(res);
            if (type === 'DOCTOR') {
              this.Notificator.showmessage('Please contact Administrator for Activation');
            } else {
              this.Notificator.showmessage('Registration successful');
            }
            this.loginUser(mail, password);
          },
          (err: HttpErrorResponse) => {
            this.Notificator.showmessage('Error: ' + err.error.error);
            if (err instanceof ErrorEvent) {
              // A client-side or network error occurred. Handle it accordingly.
              console.error('An error occurred:', err.message);
            } else {
              // The backend returned an unsuccessful response code.
              // The response body may contain clues as to what went wrong,
              console.error(
                `Backend returned code ${err.status}, ` +
                `body was: ${err.message}`);
            }
            // return an observable with a user-facing error message
            return throwError(
              'Something bad happened; please try again later.');
            console.log('Error occured');
          }
        );
    } else {
      console.log('you are logged in');
    }
  }

  loginUser(email: string, password: string): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      if (this.authenticated === false) {
        const req = this.http.post(this.API_URL + '/login', {
          mail: email,
          password: password,
        })
          .subscribe(
            res => {
              console.log(res);
              resolve(this.getSessionStatus());
            },
            err => {
              this.Notificator.showmessage('Error: ' + err.error.error);
              console.log('Error occured');
              reject(err);
            }
          );
      } else {
        this.Notificator.showmessage('Logged in');
        resolve();
      }
    }));

  }

  bookSlot(slotid: string): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      const req = this.http.post(this.API_URL + '/slot/' + slotid, {
        _id: slotid,
      })
        .subscribe(
          res => {
            console.log(res);
            // @ts-ignore
            this.Notificator.showmessage(res.message);
          },
          err => {
            this.Notificator.showmessage('Error: ' + err.error.error);
            console.log('Error occured');
            reject(err);
          }
        );
    }));
  }

  logoutUser(): void {
    if (this.authenticated === true) {

      const req = this.http.post(this.API_URL + '/logout', {})
        .subscribe(
          res => {
            console.log(res);
            this.Notificator.showmessage('Logged out');
            console.log('logged out');
            this.getSessionStatus().then(() => {
              this.router.navigateByUrl('/login');
            });
          },
          err => {
            console.log(err);
            this.Notificator.showmessage('Error: ' + err.error.error);
            console.log('Error occured');
          }
        );

    } else {
      console.log('you are logged out');
      this.authSubject.next(false);
      this.router.navigateByUrl('\login');
    }
    this.getSessionStatus();
  }
}
