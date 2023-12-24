import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { IProject } from '@mwazi/shared/data-models';

@Component({
  standalone: true,
  templateUrl: 'activation-success-dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  styleUrls: ['activation-success-dialog.component.scss']
})

export class ActivationSuccessDialogComponent {
  projectIsActive = signal(false)
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: IProject,
    iconService: IconService
  ) {
    this.projectIsActive.set(data.status === 'Active')
    iconService.registerIcons([IconListEnum.ThumbsUp])
  }

}
