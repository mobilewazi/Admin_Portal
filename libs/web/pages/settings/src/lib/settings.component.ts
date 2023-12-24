import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigService } from '@mwazi/web/config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ProfileComponent } from './components/profile/profile.component';
import { LinkCardComponent } from './components/link-card/link-card.component';
import { IconListEnum, IconService } from '@mwazi/shared/icons';

@Component({
  selector: 'mwazi-settings',
  standalone: true,
  imports: [
    ProfileComponent,
    LinkCardComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  constructor(private configService: ConfigService, iconService: IconService) {


     this.configService.getAll().pipe(
       takeUntilDestroyed(),
       tap((res) => {
         console.log(res)
       })
     ).subscribe()
  }
}
