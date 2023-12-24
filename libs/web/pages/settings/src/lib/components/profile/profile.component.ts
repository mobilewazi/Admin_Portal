import { Component, signal } from '@angular/core';
import { ProfileService } from '@mwazi/shared/profile';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { IProfileUser } from '@mwazi/shared/profile';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'mwazi-setting-profile',
  templateUrl: 'profile.component.html',
  imports: [
    JsonPipe,
    MatCardModule,
    NgOptimizedImage,
    MatButtonModule
  ],
  styleUrls: ['profile.component.scss']
})

export class ProfileComponent {
  profile = signal<IProfileUser>({
    avatar: '',
    canViewReport: false,
    createdAt: '',
    email: '',
    id: 0,
    isEmailConfirmed: false,
    isPhoneNumberConfirmed: false,
    isRegisteredWith: '',
    name: '',
    phoneNumber: '',
    updatedAt: '',
    userAlt: ''
  });

  constructor(profileService: ProfileService) {
    profileService.getProfile().pipe(
      tap((res) => {
        this.profile.set(res)
        console.log(res);
      }),
      takeUntilDestroyed()
    ).subscribe()
  }
}
