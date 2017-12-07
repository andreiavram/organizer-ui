import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Tag} from './tag';
import {plainToClass} from 'class-transformer';
import 'rxjs/add/operator/toPromise';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TagService {
  private tagURL = `${environment.appURL}/tag`;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  handleError(error: any): any {
    console.error('HTTP error occured');
    return Promise.reject(error.message || error);
  }

  getTags(): Promise<Tag[]> {
    return this.http.get(this.tagURL)
      .toPromise()
      .then(response => plainToClass(Tag, response as Tag[]))
      .catch(this.handleError);
  }

  getTag(id): Promise<Tag> {
    return this.http.get(`${this.tagURL}/${id}`)
      .toPromise()
      .then(response => plainToClass(Tag, response as Tag))
      .catch(this.handleError);
  }

  searchTagObservable(q: string): Observable<Tag[]> {
    return this.http.get(`${this.tagURL}/?slug=${q}`)
      .map((response) => plainToClass(Tag, response.results as Tag[]));
  }


}
