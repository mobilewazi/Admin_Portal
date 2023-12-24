import { ChangeDetectionStrategy, Component, computed, OnDestroy, signal, TemplateRef, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe, JsonPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ITransaction } from '@mwazi/shared/data-models';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTabsModule } from '@angular/material/tabs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BackButtonComponent } from '@mwazi/shared/back-button';
import { DeleteTransactionConfirmationComponent } from '@mwazi/web/pages/projects';
import { TransactionService } from '@mwazi/shared/transaction';
import { SuccessDialogComponent } from '@mwazi/shared/alert';
import { TransactionCommentsComponent } from '../transaction-comments/transaction-comments.component';
import { CommentService, IComment } from '@mwazi/shared/comments';

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
    RouterLink,
    BackButtonComponent,
    TransactionCommentsComponent
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewTransactionComponent implements OnDestroy {
  @ViewChild('successDialogContents') private successDialogContents?: TemplateRef<any>;
  @ViewChild('successDialogActions') private successDialogActions?: TemplateRef<any>;
  destroyed$ = new Subject<null>();
  projectId = signal(0)
  transaction = signal<ITransaction>({
    additionalComment: '',
    createdAt: '',
    createdById: 0,
    id: 0,
    isDeleted: false,
    messageId: '',
    projectId: 0,
    senderName: '',
    transactionAmount: 0,
    transactionCode: '',
    transactionDate: new Date(),
    transactionType: 'C',
    txnType: '',
    updatedById: 0
  })
  isDebitTransaction = computed(() => this.transaction().transactionType === 'D')

  comments = this.commentService.comments;
  commentTabTitle = computed(() => {
    if (this.comments().length > 1) {
      return `${this.comments().length} Comments`
    } else if (this.comments().length === 1) {
      return '1 Comment';
    } else {
      return 'No Comment'
    }
  })


  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private router: Router,
    iconService: IconService,
    private commentService: CommentService
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
      IconListEnum.Delete,
    ])

    this.route.data.pipe(
      tap((res) => {
        this.transaction.set(res['transaction'] as ITransaction);
        this.projectId.set(res['project'].id)
      }),
      takeUntilDestroyed()
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
  }

  protected readonly print = print;

  openDeleteTransactionDialog() {
    const transactionDialog = this.dialog.open(DeleteTransactionConfirmationComponent, {})

    transactionDialog.afterClosed().pipe(
      filter((confirmed: boolean) => confirmed),
      switchMap(() => this.transactionService.delete(this.transaction().id)),
      switchMap(() => {
        const successDialog = this.dialog.open(SuccessDialogComponent, {
          disableClose: true,
          data: {
            dialogContents: this.successDialogContents,
            dialogActions: this.successDialogActions,
          }
        })
        return successDialog.afterClosed().pipe(
          filter((goToProjectDetails) => goToProjectDetails),
          switchMap(() => this.router.navigate(['projects', this.projectId()]))
        )
      }),
    ).subscribe()
  }
}
