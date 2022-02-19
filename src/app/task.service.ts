import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Task } from './task';
import { MessageService } from './message.service';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {TagService} from './tag.service';
import {Tag} from './tag';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksURL = 'http://127.0.0.1:8000/api/task/'

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private tagService: TagService) {
  }

  getTasks(): Observable<Task[]> {
     return this.http.get<Task[]>(this.tasksURL)
      .pipe(
        tap((tasks: Task[]) => tasks.map((task: Task) => {
          this.processTaskTags(task);
          return task;
        })),
        tap(_ => this.log(`fetched ${_.length} tasks`)),
        catchError(this.handleError<Task[]>('getTasks', [])),
      )
  }

  getTagsForTask(task: Task) {
    if (!task.tags) {
      task.tags = [];
    }

    return this.tagService.getTagsByID(task.tags);
  }

  getTask(id: number): Observable<Task> {
    const url = `${this.tasksURL}${id}`
    return this.http.get<Task>(url)
      .pipe(
        tap((task: Task) => { this.processTaskTags(task)} ),
        tap(_ => this.log(`fetched task ${id}`)),
        catchError(this.handleError<Task>('getTask'))
      );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.tasksURL, task, this.httpOptions)
      .pipe(
        tap((newTask: Task) => this.log(`added task id=${newTask.id}`)),
        tap((task: Task) => { this.processTaskTags(task)}),
        catchError(this.handleError<Task>('save task'))
      );
  }

  deleteTask(id: number): Observable<Task> {
    const url = `${this.tasksURL}${id}/`;
    return this.http.delete<Task>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted task with ID ${id}`)),
        catchError(this.handleError<Task>('deleted task'))
      );
  }

  processTaskTags(task: Task) {
    if (task.tags.length) {
      this.tagService.getTagsByID(task.tags).subscribe((tags: Tag[]) => {
        task._tags = tags
      });
    }
  }

  updateTask(task: Task): Observable<Task> {
    const url = `${this.tasksURL}${task.id}/`;
    // make sure task.tags contains all task._tags
    // they can get unsynced if we edit the Task and change tags
    task.tags = [];
    if (task._tags) {
      task.tags = task._tags.map(tag => tag.id)
    }

    return this.http.put<Task>(url, task, this.httpOptions)
      .pipe(
        tap((task: Task) => { this.processTaskTags(task) }),
        tap((updatedTask: Task) => this.log(`updated task id=${updatedTask.id}`)),
        catchError(this.handleError<Task>('update task'))
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
