import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LinkCardComponent, ProfileComponent } from '@mwazi/web/pages/settings';
import { IconListEnum, IconService } from '@mwazi/shared/icons';

@Component({
  selector: 'mwazi-web-pages-layout',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    NgForOf,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    LinkCardComponent,
    ProfileComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  constructor(iconService: IconService) {
    iconService.registerIcons([
      IconListEnum.User,
      IconListEnum.Faq,
      IconListEnum.Text,
      IconListEnum.HeadPhones,
    ]);
  }
  links = signal([
    {href: ['/dashboard'], label: 'Dashboard', icon: 'home'},
    {href: ['/projects'], label: 'Projects', icon: 'home'},
    {href: ['/users'], label: 'Users', icon: 'user'},
    {href: ['/settings'], label: 'Settings', icon: 'settings'},
  ]);

  openProfileDialog(drawerProfile: MatDrawer, drawer: MatDrawer) {
    if (!drawerProfile.opened) {
      drawer.close();
    } else {
      drawer.open();
    }

    drawerProfile.toggle();

  }
}
