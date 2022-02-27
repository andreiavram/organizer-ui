import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from '../message.service';
import {forkJoin, ObjectUnsubscribedError, Observable, of, zip} from 'rxjs';
import {Tag} from './tag';
import {catchError, tap} from 'rxjs/operators';
import {ItemCacheService} from '../item-cache.service';
import {Task} from '../tasks/task';
import {ServiceBase} from '../service-base';

@Injectable({
  providedIn: 'root'
})
export class TagService  extends ServiceBase {
  tagsURL: string = "http://127.0.0.1:8000/api/tag/";
  tagCache: Tag[] = [];

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient,
              protected messageService: MessageService,
              private tagCachingService: ItemCacheService) {
    super(messageService);
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.tagsURL)
      .pipe(
        tap((tags: Tag[]) => { this.tagCachingService.updateItems(tags) }),
        tap(_ => this.log("fetched tags-list")),
        catchError(this.handleError<Tag[]>('getTags', []))
      )
  };

  searchTags(query: string): Observable<Tag[]> {
    const url = `${this.tagsURL}?name=${query}`;
    return this.http.get<Tag[]>(url)
      .pipe(
        tap((tags: Tag[]) => { this.tagCachingService.updateItems(tags) }),
        tap(_ => this.log("fetched searched tags-list")),
        catchError(this.handleError<Tag[]>('searchTags', []))
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

  updateTag(tag: Tag): Observable<Tag> {
    const url = `${this.tagsURL}${tag.id}/`;

    return this.http.put<Tag>(url, tag, this.httpOptions)
      .pipe(
        tap((updatedTag: Tag) => this.log(`updated tag id=${updatedTag.id}`)),
        catchError(this.handleError<Tag>('update tag'))
      );
  }

  createTag(tag: Tag): Observable<Tag> {
    const url = `${this.tagsURL}`;

    return this.http.post<Tag>(url, tag, this.httpOptions)
      .pipe(
        tap((createdTag: Tag) => this.log(`created tag id=${createdTag.id}`)),
        catchError(this.handleError<Tag>('create tag'))
      )
  }
}
