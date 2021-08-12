import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Task } from './task';
import { MessageService } from './message.service';
import {Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {TagService} from './tag.service';
import {Tag} from './tag';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksURL = 'http://127.0.0.1:8000/api/task/'

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksURL)
      .pipe(
        tap(_ => this.log(`fetched ${_.length} tasks`)),
        map(function(tasks: Task[]) {
          return tasks.map(function (task: Task) {
            task.tags = task.tags?.map(tag => tag as Tag);
            task.tags = task.tags as Tag[];
            return task;
          });
        }),
        catchError(this.handleError<Task[]>('getTasks', []))
      );
  }

  getTask(id: number): Observable<Task> {
    const url = `${this.tasksURL}${id}`
    return this.http.get<Task>(url)
      .pipe(
        tap(_ => this.log(`fetched task ${id}`)),
        catchError(this.handleError<Task>('getTask'))
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
