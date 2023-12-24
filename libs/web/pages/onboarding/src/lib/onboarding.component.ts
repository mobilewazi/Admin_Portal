import { Component, signal } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { tap, timer } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mwazi-onboarding',
  standalone: true,
  imports: [CarouselModule, AsyncPipe, NgIf, NgForOf, NgOptimizedImage, MatButtonModule, RouterLink],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  timer$ = timer(3000);
  showLogo = signal(true);
  slides = [
    {
      image: {w: 286, h: 327, link: 'assets/images/onboarding-slide-1.svg'},
      title: 'Get control of your group funds',
      description: 'M-Wazi allows you to track your mobile funds sent to you by others for easier tracking, management and reporting.'
    },
    {
      image: {w: 291, h: 367, link: 'assets/images/onboarding-slide-2.svg'},
      title: 'Reports',
      description: 'Generate transaction reports and easily share with others to have a clear overview of your group funds.'
    },
    {
      image: {w: 342, h: 316, link: 'assets/images/onboarding-slide-3.svg'},
      title: 'Create multiple projects',
      description: 'Manage and track multiple projects and easily share reports and useful metrics.'
    },
    {
      image: {w: 246, h: 316, link: 'assets/images/onboarding-slide-4.svg'},
      title: 'Obtain verified reports',
      description: 'Get M-Wazi verified reports that give trust and peace of mind to the contributors.'
    }
  ];
  customOptions: OwlOptions = {
    items: 1,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    nav: false,
    autoplay: true,
  }

  constructor() {
    this.timer$.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.showLogo.set(false)
      })
    ).subscribe()
  }
}
