import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageConstants } from '../utils/session.storage';

@Injectable({ providedIn: 'root' })


// * Agrego un header a todas las peticiones que realizamos al servidor
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = sessionStorage.getItem(SessionStorageConstants.USER_TOKEN);
    if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          },
        });
      }

    return next.handle(req);
  }
}
