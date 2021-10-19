import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  // constructor(private authService: AuthService) {}
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authService = this.injector.get(AuthService);
    const authToken = authService.getUserToken();

    // if we don't have an auth token, just process the request as usual
    if (!authToken)
       return next.handle(request);

    const authRequest = request.clone({
      headers: request.headers.set('Authorization', `Token ${authToken}`)
    })

    return next.handle(authRequest);
  }
}
