import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from './message.service';
import {User} from './user';
import {catchError, tap} from 'rxjs/operators';
import {Task} from './task';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string | null = null;

  loginURL: string = 'http://127.0.0.1:8000/rest-auth/login/';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  login(loginData: any): Observable<User> {
    return this.http.post<User>(this.loginURL, loginData, this.httpOptions)
      .pipe(
        tap((user: User) => { this.saveUserToken(user) }),
        catchError(this.handleError<User>('do login'))
      )
  }

  saveUserToken(user: User): void {
    localStorage.setItem('token', user.key);
  }

  getUserToken(): string | null {
    return localStorage.getItem('token')
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed ${error.message}`);
      return throwError(error);
    }
  }
  private log(message: string) {
    this.messageService.add(`AuthService: ${message}`);
  }

}
