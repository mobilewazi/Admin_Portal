import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mwazi-alert',
  standalone: true,
  imports: [MatDialogContent, MatIconModule, MatButtonModule, MatDialogClose, MatDialogActions],
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorAlertComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {errorMessage: string}) {
  }
}
