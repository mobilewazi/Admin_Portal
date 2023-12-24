import { Component, Input } from '@angular/core';
import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconListEnum, IconService } from '@mwazi/shared/icons';

@Component({
  standalone: true,
  selector: 'mwazi-link-card',
  templateUrl: 'link-card.component.html',
  imports: [
    JsonPipe,
    MatCardModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule
  ],
  styleUrls: ['link-card.component.scss']
})

export class LinkCardComponent {
  @Input({ required : true}) cardTitle = ''
  @Input() subTitle?: string;
  @Input({transform: (value: string) => value as IconListEnum }) icon?: IconListEnum;
  constructor(iconService: IconService) {
    iconService.registerIcons([
      IconListEnum.ChevronRight,
      IconListEnum.Submit,
    ])
  }
}
