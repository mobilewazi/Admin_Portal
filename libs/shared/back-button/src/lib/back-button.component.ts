import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'mwazi-back-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  constructor(iconService: IconService, private navigationService: NavigationService) {
    iconService.registerIcons([
      IconListEnum.ArrowBack
    ])
  }

  back() {
    this.navigationService.back();
  }
}
