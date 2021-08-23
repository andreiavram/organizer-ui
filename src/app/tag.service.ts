import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from './message.service';
import {forkJoin, ObjectUnsubscribedError, Observable, of, zip} from 'rxjs';
import {Tag} from './tag';
import {catchError, tap} from 'rxjs/operators';
import {ItemCacheService} from './item-cache.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tagsURL: string = "http://127.0.0.1:8000/api/tag/";
  tagCache: Tag[] = [];

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private tagCachingService: ItemCacheService) { }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.tagsURL)
      .pipe(
        tap((tags: Tag[]) => { this.tagCachingService.updateItems(tags) }),
        tap(_ => this.log("fetched tags")),
        catchError(this.handleError<Tag[]>('getTags', []))
      )
  };

  getTag(id: number): Observable<Tag> {
    let cachedTag: Tag = this.tagCachingService.getItem(id) as Tag;

    if (cachedTag) {
      return of(cachedTag);
    }

    const url = `${this.tagsURL}${id}`
    return this.http.get<Tag>(url)
      .pipe(
        tap(_ => this.log(`fetched tag ${id}`)),
        catchError(this.handleError<Tag>('getTag', undefined))
      )
  }

  getTagBySlug(slug: string): Observable<Tag[]> {
    const url = `${this.tagsURL}?slug=${encodeURI(slug)}`;
    return this.http.get<Tag[]>(url)
      .pipe(
        tap((tags: Tag[]) => { this.tagCachingService.updateItems(tags)}),
        tap(_ => this.log(`fetched tag for ${slug}`)),
        catchError(this.handleError<Tag[]>('getTagBySlug'))
      )
  }

  getTagsByID(ids: number[]) {
    let obs: Observable<Tag>[] = [];
    ids.forEach((id: number) => obs.push(this.getTag(id)));
    return forkJoin(obs);
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
