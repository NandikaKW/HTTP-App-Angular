import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class HttpManagerInterceptor implements HttpInterceptor {

  constructor(private service: LoadingService) {
    console.log('interceptor');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.service.loading.next(true);

    return next.handle(request).pipe(
      finalize(() => {
        this.service.loading.next(false); 
      })
    );
  }
}
// 1:09
