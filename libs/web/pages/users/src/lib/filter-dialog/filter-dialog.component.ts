import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mwazi-filter-dialog',
  standalone: true,
  templateUrl: 'filter-dialog.component.html',
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
  styleUrls: ['filter-dialog.component.scss']
})

export class FilterDialogComponent {

  constructor( private dialogRef: MatDialogRef<FilterDialogComponent>) {
  }

  filterReport() {

  }
}

``
