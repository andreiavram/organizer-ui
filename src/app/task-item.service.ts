import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {TaskItem} from './task-item';
import 'rxjs/add/operator/toPromise';
import {environment} from '../environments/environment';
import {plainToClass} from 'class-transformer';

@Injectable()
export class TaskItemService {
  private taskItemURL = environment.appURL + '/task/?page=1&per_page=20&completed=true';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}
  getTaskItems(): Promise<TaskItem[]> {
    return this.http.get(this.taskItemURL)
      .toPromise()
      .then(response => plainToClass(TaskItem, response.json() as TaskItem[]))
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('HTTP error occured');
    return Promise.reject(error.message || error);
  }

  getTaskItem(id: number): Promise<TaskItem> {
    const url = `${this.taskItemURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => plainToClass(TaskItem, response.json() as TaskItem))
      .catch(this.handleError);
  }
}
