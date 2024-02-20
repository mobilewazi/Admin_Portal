import { Component, computed, signal } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, JsonPipe, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';
import { BackButtonComponent } from '@mwazi/shared/back-button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import {
  TransactionsTableComponent
} from '../../../../projects/src/lib/transactions-table/transactions-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkTableModule } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  imports: [
    JsonPipe,
    BackButtonComponent,
    MatIconModule,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    TransactionsTableComponent,
    MatTabsModule,
    CdkTableModule,
    MatChipsModule,
    MatSortModule,
    MatTableModule,
    NgSwitchCase,
    NgSwitch,
    RouterLink,
    NgStyle
  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})

export class ViewUserComponent {

  userId$ = this.route.paramMap.pipe(map((params) => params.get('id') as string));
  userDetails = signal<any>({projects: [], transactions: []})
  user$ = this.userId$.pipe(
    switchMap((userId) => this.userService.getById(userId)),
    tap((res) => {
      this.userDetails.set(res)
    })
  );
  columns = signal([
    {columnName: 'id', type: 'text', label: 'ID'},
    {columnName: 'createdAt', type: 'date', label: 'Created At'},
    {columnName: 'projectName', type: 'link-text', label: 'Project Name', linkField: 'id'},
    {columnName: 'projectCode', type: 'text', label: 'Project Code'},
    {columnName: 'targetAmount', type: 'amount', label: 'Target Amount'},
    {columnName: 'startDate', type: 'date', label: 'Start Date'},
    {columnName: 'endDate', type: 'date', label: 'End Date'},
    {columnName: 'category', type: 'text', label: 'Category'},
    {columnName: 'status', type: 'active', label: 'Active'}
  ]);

  private _selectedColumns = signal(['projectCode', 'createdAt', 'projectName', 'category', 'status']);
  displayedColumns = computed(() => [...this._selectedColumns(), 'actions']);

  constructor(private userService: UsersService, private route: ActivatedRoute) {
    this.user$.pipe(
      takeUntilDestroyed()
    ).subscribe();
  }
}
