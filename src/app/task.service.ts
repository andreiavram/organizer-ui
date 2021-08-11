import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Task } from './task';
import { MessageService } from './message.service';
import {Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksURL = 'http://127.0.0.1:8000/api/task/'

  constructor(private http: HttpClient,
      private messageService: MessageService) {

  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksURL)
      .pipe(
        tap(_ => this.log('fetched tasks')),
        catchError(this.handleError<Task[]>('getHeroes', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed ${error.message}`);
      return of(result as T);
    }
  }
  private log(message: string) {
    this.messageService.add(`TaskService: ${message}`);
  }
}
