import { Component, computed, effect, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemePalette } from '@angular/material/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DashboardService, ICardProps } from '@mwazi/web/dashboard';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mwazi-add-dashboard-card-item-dialog',
  standalone: true,
  templateUrl: 'add-dashboard-card-item-dialog.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    JsonPipe,
    MatTooltipModule,
    MatDialogTitle,
    MatDialogContent,
    MatCheckboxModule,
    MatDialogActions,
    FormsModule,
    MatDialogClose
  ],
  styleUrls: ['add-dashboard-card-item-dialog.component.scss']
})

export class AddDashboardCardItemDialogComponent {
  @Input({required: true}) cardData: { icon: string, iconColor: ThemePalette, value: string } = {
    value: '',
    icon: '',
    iconColor: 'primary',
  };

  dashboardCardPreference = computed(() => {
    return Object.values(this.dashboardService.dashboardCardPreference())
  })
  items: (ICardProps & { selected?: boolean })[] = [];


  constructor(private dashboardService: DashboardService, private dialogRef: MatDialogRef<AddDashboardCardItemDialogComponent>) {
    effect(() => {
      this.items = this.dashboardCardPreference().map((value) => ({...value, selected: !value.removed}))
    })
  }

  updateFields() {
    const k = this.items.reduce((prev, {selected, ...next}) => {
      return {...prev, [next.key]: {...next, removed: !selected}}
    }, {} as any)
    this.dashboardService.storeDashboardPreference(
      k as any
    )

    this.dialogRef.close()
  }
}

``
