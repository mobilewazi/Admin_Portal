import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { LoadingService } from './loading.service';
@Component({
  selector: 'mwazi-loading',
  standalone: true,
  imports: [NgIf, LottieComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent  implements OnInit {
  options: AnimationOptions = {
    path: './assets/loading.json',
  };

  showLoader = this.loadingService.showLoader

  constructor( private cdRef: ChangeDetectorRef, private loadingService: LoadingService) {}

  ngOnInit(): void {
    // this.init();
  }

  // init(): void {
  //   this.spinnerService.spinnerObserver$.subscribe((status) => {
  //     this.showSpinner = status === 'start';
  //     this.cdRef.detectChanges();
  //   });
  // }

  animationCreated(event: any): void {
    // console.log(animationItem);
  }
}

