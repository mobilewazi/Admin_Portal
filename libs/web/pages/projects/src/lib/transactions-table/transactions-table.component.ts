import { Component, Input, signal, TemplateRef, ViewChild } from '@angular/core';
import { CdkTableModule, DataSource } from '@angular/cdk/table';
import { ITransaction } from '@mwazi/shared/data-models';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { TransactionPipe } from '../view-project-report/transaction.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import {
  DeleteTransactionConfirmationComponent
} from '@mwazi/web/pages/projects';
import { TransactionService } from '@mwazi/shared/transaction';
import { RouterLink } from '@angular/router';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { SuccessDialogComponent } from '@mwazi/shared/alert';


export class TransactionDataSource extends DataSource<ITransaction> {
  data = signal<ITransaction[]>([]);
  observedData = toObservable(this.data);

  connect(): Observable<ITransaction[]> {
    return this.observedData
  }

  disconnect() {
  }
}

@Component({
  selector: 'mwazi-transaction-table',
  standalone: true,
  templateUrl: 'transactions-table.component.html',
  imports: [
    CdkTableModule,
    JsonPipe,
    DatePipe,
    CurrencyPipe,
    TransactionPipe,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatDialogClose
  ],
  styleUrls: ['transactions-table.component.scss']
})

export class TransactionsTableComponent {
  @ViewChild('successDialogContents') private successDialogContents?: TemplateRef<any>;
  @ViewChild('successDialogActions') private successDialogActions?: TemplateRef<any>;
  dataSource = new TransactionDataSource();

  @Input({required: true})
  set transactions(transactions: ITransaction[]) {
    this.dataSource.data.set(transactions)
  }

  displayedColumns: string[] = ['label', 'amount', 'actions'];

  constructor(
    iconService: IconService,
    private dialog: MatDialog,
    private transactionService: TransactionService
  ) {
    iconService.registerIcons([
      IconListEnum.Delete,
      IconListEnum.Eye
    ])
  }

  openDeleteConfirmationDialog(transactionId: number) {
    const transactionDialog = this.dialog.open(DeleteTransactionConfirmationComponent, {})

    transactionDialog.afterClosed().pipe(
      filter((confirmed: boolean) => confirmed),
      switchMap(() => this.transactionService.delete(transactionId)),
      tap((res) => {
        console.log(res)
      })
    ).subscribe()
  }

  openEditTransactionDialog(transaction: ITransaction) {
    const editTransactionDialog = this.dialog.open(CreateTransactionComponent, {
      maxWidth: '600px',
      disableClose: true,
      data: transaction
    });

    editTransactionDialog.afterClosed().pipe(
      filter((transaction: ITransaction) => !!transaction),

      switchMap((res) => {
        const successDialog = this.dialog.open(SuccessDialogComponent, {
          disableClose: true,
          data: {
            dialogContents: this.successDialogContents,
            dialogActions: this.successDialogActions,
            dialogContentsContext: true
          }
        })
        return successDialog.afterClosed().pipe(
          tap((res) => {
            const transactionsArray = [...this.dataSource.data()];
            const indexOfTransactionToUpdate = transactionsArray.findIndex(
              ({id}) => id === res.id
            );

            if (indexOfTransactionToUpdate !== -1) {
              // Update the transaction with the specified id
              transactionsArray[indexOfTransactionToUpdate] = {
                ...transactionsArray[indexOfTransactionToUpdate], // Copy existing values
                ...res,  // Override with new values
              };
            }
            this.dataSource.data.set([...transactionsArray])
          })
        )
      }),


    ).subscribe()
  }
}
