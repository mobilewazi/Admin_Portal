import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, signal, ViewChild } from '@angular/core';
import {
  AsyncPipe,
  DatePipe,
  JsonPipe,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ProjectService } from '@mzima/shared/projects';
import { catchError, EMPTY, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectInterface } from '@mwazi/shared/data-models';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BackButtonComponent } from '@mwazi/shared/back-button';
import { CdkTableModule } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';



@Component({
  selector: 'mwazi-web-pages-projects',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatTableModule,
    MatSortModule,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    DatePipe,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    RouterLink,
    JsonPipe,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NgxSkeletonLoaderModule,
    BackButtonComponent,
    NgStyle,
    CdkTableModule,
    MatChipsModule
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebPagesProjectsComponent implements AfterViewInit {
  loading = signal(false);
  get selectedColumns(): string[] {
    return this._selectedColumns();
  }

  set selectedColumns(value: string[]) {
    this._selectedColumns.set(value);
  }

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

  selectColumns = computed(() => this.columns().map((column) => ({
    ...column,
    selected: this._selectedColumns().includes(column.columnName)
  })))
  dataSource = new MatTableDataSource<ProjectInterface>();

  projects = signal<ProjectInterface[]>([]);


  constructor(private _liveAnnouncer: LiveAnnouncer, projectService: ProjectService) {
    this.loading.set(true);
    projectService.getAll().pipe(
      tap((res) => {
        this.projects.set(res);
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
      this.dataSource.data = this.projects();
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
