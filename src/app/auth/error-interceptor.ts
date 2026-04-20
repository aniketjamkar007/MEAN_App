
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Error } from '../error/error';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occurred!';
                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }this.dialog.open(Error, {
                    data: {
                        message: errorMessage
                    }
                });
                return throwError(() => errorMessage);
            })
        );
    }
}