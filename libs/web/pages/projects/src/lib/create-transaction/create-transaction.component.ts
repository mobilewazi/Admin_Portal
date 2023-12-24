import { Component, Inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TransactionService } from '@mwazi/shared/transaction';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { ITransaction } from '@mwazi/shared/data-models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { SuccessDialogComponent } from '@mwazi/shared/alert';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  templateUrl: 'create-transaction.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    JsonPipe,
    MatIconModule
  ],
  styleUrls: ['create-transaction.component.scss']
})

export class CreateTransactionComponent implements OnInit {
  transactionId = signal<null | number>(null);
  form = this.fb.group({
    paymentType: ['M-PESA' as 'CASH' | 'M-PESA'],
    senderName: ['', Validators.required],
    transactionAmount: [null as null | number, [Validators.required, Validators.min(0)]],
    transactionDate: ['' as string | Date, Validators.required],
    transactionCode: ['', Validators.required],
    transactionType: [null as null | 'D' | 'C', Validators.required],
    additionalComment: ['', Validators.required],
    messageId: ['', Validators.required],
    projectId: [{value: null as null | number, disabled: true}, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: ITransaction,
    private transactionService: TransactionService,
    private matDialogRef: MatDialogRef<CreateTransactionComponent>
  ) {
    this.form.get('paymentType')?.valueChanges.pipe(
      tap((paymentType) => {
        if (paymentType === 'CASH') {
          this.form.get('transactionCode')?.disable();
          this.form.get('messageId')?.disable();
          this.form.get('additionalComment')?.disable();
        } else {
          this.form.get('transactionCode')?.enable();
          this.form.get('messageId')?.enable();
          this.form.get('additionalComment')?.enable();
        }

      }),
      takeUntilDestroyed()
    ).subscribe()
  }

  ngOnInit(): void {
    this.form.get('projectId')?.setValue(this.data.projectId);
    if (this.data.id) {
      this.transactionId.set(this.data.id)
      this.form.patchValue(this.data);
    }

  }

  submitForm() {
    let action: Observable<ITransaction | ITransaction[]>;
    const data = {
      ...this.form.value,
      projectId: this.data.projectId
    };

    if (this.form.get('paymentType')?.value === 'CASH') {
      action = this.transactionService.manualMapping(data)
    } else {

      if (this.transactionId()) {
        action = this.transactionService.update({
          transactionId: this.transactionId() as number,
          data
        })
      } else {
        action = this.transactionService.create(data)
      }
    }

    action.pipe(
      tap((res) => {
        if (this.form.get('paymentType')?.value === 'CASH') {
          console.log("mpesa", {...this.form.value, ...(res as ITransaction[])[0]})
          this.matDialogRef.close({
            ...this.form.value, ...(res as ITransaction[])[0]})
        } else {
          console.log("mpesa", res)
          this.matDialogRef.close(res)
        }

      })
    ).subscribe()
  }
}
