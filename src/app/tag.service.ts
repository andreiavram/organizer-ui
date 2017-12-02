import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Tag} from './tag';
import {plainToClass} from 'class-transformer';
import 'rxjs/add/operator/toPromise';
import {environment} from '../environments/environment';

@Injectable()
export class TagService {
  private tagURL = `${environment.appURL}/tag`;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  handleError(error: any): any {
    console.error('HTTP error occured');
    return Promise.reject(error.message || error);
  }

  getTags(): Promise<Tag[]> {
    return this.http.get(this.tagURL)
      .toPromise()
      .then(response => plainToClass(Tag, response.json() as Tag[]))
      .catch(this.handleError);
  }

  getTag(id): Promise<Tag> {
    return this.http.get(`${this.tagURL}/${id}`)
      .toPromise()
      .then(response => plainToClass(Tag, response.json() as Tag))
      .catch(this.handleError);
  }


}
