import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MessageService} from './message.service';
import {LoginData} from './loginData';
import {catchError, tap} from 'rxjs/operators';
import {User} from './user';
import {ServiceBase} from './service-base';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ServiceBase {
  isLoggedIn = false;
  redirectUrl: string | null = null;

  private loginURL: string = 'http://127.0.0.1:8000/rest-auth/login/';
  private userURL: string = 'http://127.0.0.1:8000/rest-auth/user/'

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    protected messageService: MessageService,
  ) {
    super(messageService);
  }

  login(loginData: any): Observable<LoginData> {
    return this.http.post<LoginData>(this.loginURL, loginData, this.httpOptions)
      .pipe(
        tap((user: LoginData) => {
          this.saveUserToken(user);
          this.isLoggedIn = true;
        }),
        catchError(this.handleError<LoginData>('do login'))
      )
  }

  saveUserToken(user: LoginData): void {
    localStorage.setItem('token', user.key);
  }

  getUserToken(): string | null {
    return localStorage.getItem('token')
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.userURL, this.httpOptions)
      .pipe(
        tap((user: User) => { this.currentUser = user}),
        catchError(this.handleError<User>('get user')))
  }

  public isAuthenticated(): boolean {
    return !!this.getUserToken();
  }
}

