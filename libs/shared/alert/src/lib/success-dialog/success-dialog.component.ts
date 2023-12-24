import { Component, Inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: 'success-dialog.component.html',
  imports: [
    MatDialogModule,
    NgTemplateOutlet
  ],
  styleUrls: ['success-dialog.component.scss']
})

export class SuccessDialogComponent {
  // projectIsActive = signal(false)
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      dialogContents: TemplateRef<any>,
      dialogActions: TemplateRef<any>
      dialogContentsContext: Record<string, string>,
      dialogActionsContext: Record<string, string>,
    },
    iconService: IconService
  ) {
    // this.projectIsActive.set(data.status === 'Active')
    iconService.registerIcons([IconListEnum.ThumbsUp])
  }

}
