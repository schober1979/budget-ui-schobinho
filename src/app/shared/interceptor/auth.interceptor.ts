/*
Der `AuthInterceptor` interceptet jeden Request und schreibt das Token (wenn vorhanden) in ein Request Header Feld namens `Authorization` mit Präfix `Bearer`.
Der `AuthInterceptor` wird erst gebraucht, wenn HTTP Requests an das Backend gesendet werden.
 */

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { mergeMap, Observable, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AngularFireAuth) {}

  intercept = (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> =>
    this.auth.idToken.pipe(
      take(1),
      mergeMap((token) =>
        next.handle(token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request),
      ),
    );
}
