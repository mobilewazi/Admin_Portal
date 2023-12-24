import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {
  loadingRequestCount = signal(0);
  showLoader = computed(() => this.loadingRequestCount() > 0)

  startLoading() {
    this.loadingRequestCount.set(this.loadingRequestCount() + 1)
  }

  endLoading() {
    this.loadingRequestCount.set(Math.max(this.loadingRequestCount() - 1, 0))
  }
}
