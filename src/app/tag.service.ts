import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from './message.service';
import {Observable, of} from 'rxjs';
import {Tag} from './tag';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tagsURL: string = "http://127.0.0.1:8000/api/tag/"

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.tagsURL)
      .pipe(
        tap(_ => this.log("fetched tags")),
        catchError(this.handleError<Tag[]>('getTags', []))
      )
  };

  getTag(id: number): Observable<Tag> {
    const url = `${this.tagsURL}${id}`
    return this.http.get<Tag>(url)
      .pipe(
        tap(_ => this.log(`fetched tag ${id}`)),
        catchError(this.handleError<Tag>('getTag', undefined))
      )

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
