import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mwazi-dashboard-card',
  standalone: true,
  templateUrl: 'dashboard-card.component.html',
  imports: [
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  styleUrls: ['dashboard-card.component.scss']
})

export class DashboardCardComponent {
  @Input({required: true}) cardTitle = '';
  @Input() navigatesTo:string[] = []
  @Output() removeCard = new EventEmitter()
  @Output() expandCard = new EventEmitter()
}

