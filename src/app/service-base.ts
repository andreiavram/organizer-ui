import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';

export class ServiceBase {

  constructor(
    protected messageService: MessageService) {
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed ${error.message}`);
      return of(result as T);
    }
  }

  protected log(message: string) {
    this.messageService.add(`TaskService: ${message}`);
  }
}
