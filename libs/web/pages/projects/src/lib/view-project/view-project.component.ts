import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CurrencyPipe, DatePipe, JsonPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IProject, ITransaction } from '@mwazi/shared/data-models';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivateProjectComponent } from '../activate-project/activate-project.component';
import { ActivationSuccessDialogComponent } from '../activation-success-dialog/activation-success-dialog.component';
import { TransactionsTableComponent } from '../transactions-table/transactions-table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SuccessDialogComponent } from '@mwazi/shared/alert';

@Component({
  selector: 'mwazi-report',
  standalone: true,
  imports: [
    NgOptimizedImage,
    JsonPipe,
    DatePipe,
    CdkTableModule,
    NgIf,
    CurrencyPipe,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    MatTabsModule,
    TransactionsTableComponent,
    RouterLink
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewProjectComponent implements OnDestroy {
  @ViewChild('successDialogContents') private successDialogContents?: TemplateRef<any>;
  @ViewChild('successDialogActions') private successDialogActions?: TemplateRef<any>;
  destroyed$ = new Subject<null>()
  project = signal<IProject>({
    amountToBePaid: 0,
    canViewRePort: false,
    isProjectActive: false,
    paymentComplete: false,
    paymentThresholdMet: false,
    projectAdmin: '',
    projectPayments: [],
    reportLink: '',
    transactionSummary: [],
    transactions: [],
    category: '',
    createdAt: '',
    deactivateOnEndDateReached: false,
    deactivateOnTargetAmountReached: false,
    deactivateWhenExpenseExceedCollection: false,
    description: '',
    endDate: '',
    id: 0,
    otherCategory: '',
    projectCode: '',
    projectLink: '',
    projectName: '',
    startDate: '',
    status: 'Active',
    targetAmount: 0
  })

  totalCollections = computed(() => this.project().transactionSummary
    .filter(transaction => transaction.Category === "MoneyIn")
    .reduce((sum, transaction) => sum + transaction.Total, 0)
  )

  totalExpenses = computed(() => this.project().transactionSummary
    .filter(transaction => transaction.Category === "MoneyOut")
    .reduce((sum, transaction) => sum + transaction.Total, 0)
  )
  totalBalance = computed(() => this.totalCollections() - this.totalExpenses())

  projectIsActive = computed(() => this.project().status === 'InActive')
  transactions = signal<ITransaction[]>([]);

  transactionsSorted = computed(() =>
    this.transactions().sort(({transactionDate: a}, {transactionDate: b}) => new Date(a) > new Date(b) ? 1 : -1)
  )

  projectUpdated = effect(() => {
    const transactions = this.project().transactions
    this.transactions.set([...transactions]);
  }, {
    allowSignalWrites: true
  });

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    iconService: IconService
  ) {
    iconService.registerIcons([
      IconListEnum.Share,
      IconListEnum.ViewReport,
      IconListEnum.Calendar,
      IconListEnum.Target,
      IconListEnum.HandGiving,
      IconListEnum.Dot,
      IconListEnum.Plus,
      IconListEnum.Edit,
    ])

    this.route.data.pipe(
      tap((res) => {
        this.project.set(res['project'] as IProject);
      }),
      takeUntilDestroyed()
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
  }

  openNewTransactionDialog(): void {
    const dialogRef = this.dialog.open(CreateTransactionComponent, {
      maxWidth: '600px',
      disableClose: true,
      data: {
        projectId: this.project().id
      }
    });

    dialogRef.afterClosed().pipe(
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
          map(() => res)
        )
      }),
      tap((transaction) => {
        console.log({transaction})
        this.transactions.set([...this.transactions(), transaction])
      })
    ).subscribe();
  }

  toggleProjectActiveStatus() {
    const activationDialog = this.dialog.open(ActivateProjectComponent, {
      data: this.project(),
      maxWidth: '600px',
      minWidth: '600px'
    });
    activationDialog.afterClosed().pipe(
      filter((project?: IProject) => !!project),
      tap((res) => {
        this.dialog.open(ActivationSuccessDialogComponent, {
          maxWidth: '600px',
          minWidth: '600px',
          data: res
        });
        this.project.update((project) => ({...project, ...res}));
      }),
      takeUntil(this.destroyed$)
    ).subscribe()
  }
}
