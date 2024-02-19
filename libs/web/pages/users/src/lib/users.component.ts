import { AfterViewInit, Component, computed, effect, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProjectInterface, UsersInterface } from '@mwazi/shared/data-models';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { catchError, EMPTY, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { BackButtonComponent } from '@mwazi/shared/back-button';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from './users.service';

@Component({
  selector: 'mwazi-users',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, CdkTableModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatOptionModule, MatSelectModule, MatSortModule, MatTableModule, NgxSkeletonLoaderModule, RouterLink, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements AfterViewInit {
  loading = signal(false);
  get selectedColumns(): string[] {
    return this._selectedColumns();
  }

  set selectedColumns(value: string[]) {
    this._selectedColumns.set(value);
  }

  columns = signal([
    {columnName: 'createdAt', type: 'date', label: 'Created At'},
    {columnName: 'name', type: 'text', label: 'Name'},
    {columnName: 'email', type: 'link-text', label: 'Email', linkField: 'id'},
    {columnName: 'phoneNumber', type: 'text', label: 'Phone Number'},
    {columnName: 'noOfProjects', type: 'text', label: 'Projects'},
    {columnName: 'noOfTransactions', type: 'text', label: 'Transactions'},
  ]);
  private _selectedColumns = signal(['name', 'email', 'phoneNumber']);
  displayedColumns = computed(() => [...this._selectedColumns(), 'actions']);

  selectColumns = computed(() => this.columns().map((column) => ({
    ...column,
    selected: this._selectedColumns().includes(column.columnName)
  })))
  dataSource = new MatTableDataSource<ProjectInterface>();

  users = signal<UsersInterface[]>([]);


  constructor(private _liveAnnouncer: LiveAnnouncer, usersService: UsersService) {
    this.loading.set(true);
    usersService.getAll().pipe(
      tap((res) => {
        this.users.set(res);
        this.loading.set(false);
      }),
      catchError(() => {
        this.loading.set(false);
        return EMPTY
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: (res) => console.log({res})
    })

    effect(() => {
      this.dataSource.data = this.users();
    })
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

