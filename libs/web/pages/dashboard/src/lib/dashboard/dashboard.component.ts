import { ChangeDetectionStrategy, Component, computed, Signal, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CurrencyPipe, DecimalPipe, JsonPipe, NgForOf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { DashboardService, ICardProps } from '@mwazi/web/dashboard';
import { IStatistics } from '@mwazi/shared/data-models';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, DefaultDataPoint } from 'chart.js';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { DashboardMiniCardComponent } from '../dashboard-min-card/dashboard-mini-card.component';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  AddDashboardCardItemDialogComponent
} from '../add-dashboard-card-dialog/add-dashboard-card-item-dialog.component';

@Component({
  selector: 'mwazi-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    DashboardCardComponent,
    NgForOf,
    JsonPipe,
    CurrencyPipe,
    DecimalPipe,
    NgChartsModule,
    CdkDrag,
    CdkDropList,
    DashboardMiniCardComponent,
    CdkDragPlaceholder,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe, DecimalPipe]
})
export class DashboardComponent {

  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: {cols: 1, rows: 1},
          chart: {cols: 1, rows: 2},
          table: {cols: 1, rows: 4},
        };
      }

      return {
        columns: 4,
        miniCard: {cols: 1, rows: 1},
        chart: {cols: 2, rows: 2},
        table: {cols: 4, rows: 4},
      };
    })
  );


  statistics = signal<IStatistics>({
    collectionsByCategory: [],
    noOfPaymets: 0,
    projects: 0,
    projectsValue: 0,
    revenueByMonth: [],
    totalPayments: 0,
    totalUsers: 0
  });


  public barChartLegend = true;
  public barChartPlugins = [];

  revenueBarChartData: Signal<ChartConfiguration<'bar'>['data']> = computed(() =>
    this.dashboardService.revenueBarChartData(this.statistics())
  );

  categoryProjectsChartData: Signal<ChartConfiguration<'doughnut'>['data']> = computed(() =>
    this.dashboardService.categoryProjectsChartData(this.statistics())
  );

  categoryValueChartData: Signal<ChartConfiguration<'bar'>['data']> = computed(() =>
    this.dashboardService.categoryValueChartData(this.statistics())
  );
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  dashboardCardPreference = this.dashboardService.dashboardCardPreference

  dashboardCards: Signal<{
    [key: string]: {
      key: string,
      removed: boolean;
      icon: string;
      iconColor: string;
      position: number;
      title: string;
      chartType?: any;
      type: string;
      value: string | ChartData<"bar", DefaultDataPoint<"bar">, unknown> | ChartData<"doughnut", DefaultDataPoint<"doughnut">, unknown>
    }
  }> = computed(() => {
    const statistics = this.statistics();
    const k = {
      projects: {
        value: String(statistics.projects),
      },
      totalUsers: {
        value: String(statistics.totalUsers),
      },
      projectsValue: {
        value: this.currencyPipe.transform(statistics.projectsValue, 'KES ') ?? '',
      },
      noOfPayments: {
        value: this.decimalPipe.transform(statistics.noOfPaymets) ?? '',
      },
      revenuesByMonth: {
        value: this.revenueBarChartData(),
      },
      projectsPerCategory: {
        value: this.categoryProjectsChartData(),
      },
      valuePerCategory: {
        value: this.categoryValueChartData(),
      }
    };
    const p = this.dashboardCardPreference();

    const mergedObject: any = {};
    Object.keys(k).forEach(key => {
      mergedObject[key] = {
        ...(k as any)[key],
        ...(p as any)[key]
      };
    });

    return mergedObject;
  })

  dashboardCardsDisplayed = computed(() => {
    return Object.values(this.dashboardCards()).filter(({removed}) => !removed).sort(({position: a}, {position: b}) => a - b)
  })

  constructor(
    private dashboardService: DashboardService,
    private breakpointObserver: BreakpointObserver,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private dialog: MatDialog,
    iconService: IconService
  ) {
    iconService.registerIcons([
      IconListEnum.Activity,
      IconListEnum.ChartUpward,
      IconListEnum.Folder,
      IconListEnum.Users,
      IconListEnum.Edit
    ])
    dashboardService.getAll().pipe(
      tap((res) => this.statistics.set(res))
    ).subscribe()
  }

  onTileDrop($event: CdkDragDrop<any, any>) {
    const previousKey = this.dashboardCardsDisplayed()[$event.previousIndex].key;

    const adjustPosition = (obj: {
      [key: string]: ICardProps;
    }, keyToMove: string, newPosition: number) => {
      // Find the current position of the item
      const currentPosition: number = obj[keyToMove].position;

      // If the new position is less than the current position, shift items to the right
      if (newPosition < currentPosition) {
        for (const key in obj) {
          if (obj[key].position >= newPosition && obj[key].position < currentPosition && key !== keyToMove) {
            obj[key].position += 1;
          }
        }
      }
      // If the new position is greater than the current position, shift items to the left
      else if (newPosition > currentPosition) {
        for (const key in obj) {
          if (obj[key].position > currentPosition && obj[key].position <= newPosition && key !== keyToMove) {
            obj[key].position -= 1;
          }
        }
      }

      // Set the new position for the specified item
      obj[keyToMove].position = newPosition;
      return obj
    }

    this.dashboardService.storeDashboardPreference(
      adjustPosition({...this.dashboardCardPreference()}, previousKey, $event.currentIndex + 1)
    )
    // console.log($event.currentIndex, $event.previousIndex)
  }

  removeCard(key: string) {
    this.dashboardService.storeDashboardPreference({
      ...this.dashboardCardPreference(),
      [key]: {
        ...this.dashboardCardPreference()[key],
        removed: true
      }
    })
  }

  showAddCardItemDialog() {
    const dialog = this.dialog.open(AddDashboardCardItemDialogComponent);
    dialog.afterClosed().pipe(
      tap((res: string[]) => {
        console.log(res)
      })
    ).subscribe()
  }
}
