import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs';

export const addHttpLoader = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService);
  loadingService.startLoading();
  return next(req).pipe(
    finalize(() => {
      loadingService.endLoading()
    })
  );
};
