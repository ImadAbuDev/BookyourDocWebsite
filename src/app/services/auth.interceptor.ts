import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(private User: DataService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('X-Auth-Token', this.User.token)
    });
    return next.handle(authReq);
  }
}
