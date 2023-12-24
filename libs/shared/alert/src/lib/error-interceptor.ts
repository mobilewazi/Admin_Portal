import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorAlertComponent } from './alert/error-alert.component';

export const handleHttpError = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const dialog = inject(MatDialog);
  return next(req).pipe(
    catchError((err) => {
      console.log(err)
      dialog.open(ErrorAlertComponent, {
        minWidth: '300px',
        data: {
          errorMessage: err.statusText + ': ' + (err.error.message ?? '')
        }
      })
      return throwError(() => err)
    })
  );
};
