import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconListEnum, IconService } from '@mwazi/shared/icons';

@Component({
  standalone: true,
  templateUrl: 'delete-transaction-confirmation.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  styleUrls: ['delete-transaction-confirmation.component.scss']
})

export class DeleteTransactionConfirmationComponent {
  constructor(
    iconService: IconService
  ) {
    iconService.registerIcons([
      IconListEnum.Deactivate,
      IconListEnum.Activate,
    ])
  }
}
