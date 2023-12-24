import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'mwazi-dashboard-mini-card',
  standalone: true,
  templateUrl: 'dashboard-mini-card.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    JsonPipe,
    MatTooltipModule
  ],
  styleUrls: ['dashboard-mini-card.component.scss']
})

export class DashboardMiniCardComponent {
  @Input({required: true}) cardData: { icon: string, iconColor: ThemePalette, value: string } = {
    value: '',
    icon: '',
    iconColor: 'primary',
  };

}
