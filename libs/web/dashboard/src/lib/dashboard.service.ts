import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { IStatistics, ResponseInterface } from '@mwazi/shared/data-models';
import { ChartConfiguration } from 'chart.js';
import { IconListEnum } from '@mwazi/shared/icons';
import { ThemePalette } from '@angular/material/core';

export interface ICardProps {
  removed: boolean;
  position: number;
  key: string,
  title: string;
  type: 'miniCard' | 'table' | 'chart',
  icon: IconListEnum,
  iconColor: ThemePalette,
  chartType?: 'doughnut' | 'bar',
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  dashboardCardPreferenceStorageKey = 'dashboard-cards-preference';

  defaultDashboardCardsPreference: {
    [key: string]: ICardProps } = {
    projects: {
      key: 'projects',
      title: 'Projects',
      type: 'miniCard',
      icon: IconListEnum.Folder,
      iconColor: 'primary',
      position: 1,
      removed: false,
    },
    totalUsers: {
      key: 'totalUsers',
      title: 'Total Users',
      type: 'miniCard',
      icon: IconListEnum.Users,
      iconColor: 'warn',
      position: 2,
      removed: false
    },
    projectsValue: {
      key: 'projectsValue',
      title: 'Projects Value',
      type: 'miniCard',
      icon: IconListEnum.ChartUpward,
      iconColor: 'accent',
      position: 3,
      removed: false
    },
    noOfPayments: {
      key: 'noOfPayments',
      title: 'No. of Payments',
      type: 'miniCard',
      icon: IconListEnum.Activity,
      iconColor: 'primary',
      position: 4,
      removed: false
    },
    revenuesByMonth: {
      key: 'revenuesByMonth',
      title: 'Revenues By Month',
      type: 'chart',
      chartType: 'bar',
      icon: IconListEnum.Activity,
      iconColor: 'primary',
      position: 5,
      removed: false
    },
    projectsPerCategory: {
      key: 'projectsPerCategory',
      title: 'Projects Per Category',
      type: 'chart',
      chartType: 'doughnut',
      icon: IconListEnum.Activity,
      iconColor: 'primary',
      position: 6,
      removed: false
    },
    valuePerCategory: {
      key: 'valuePerCategory',
      title: 'Value Per Category',
      type: 'chart',
      chartType: 'doughnut',
      icon: IconListEnum.Activity,
      iconColor: 'primary',
      position: 7,
      removed: false
    }
  }

  dashboardCardPreference = signal(this.defaultDashboardCardsPreference);

  constructor(private http: HttpClient) {
    this.setStoredDashboardPreference();
  }

  setStoredDashboardPreference() {
    const storedPreference = localStorage.getItem(this.dashboardCardPreferenceStorageKey);
    if (storedPreference) {
      try {
        this.dashboardCardPreference.set(JSON.parse(storedPreference))
      } catch {
        this.dashboardCardPreference.set(this.defaultDashboardCardsPreference)
      }
    }
  }

  storeDashboardPreference(preference: {
    [key: string]: ICardProps
  }) {
    this.dashboardCardPreference.set(preference);
    localStorage.setItem(this.dashboardCardPreferenceStorageKey, JSON.stringify(preference))
  }

  getAll() {
    return this.http.get<ResponseInterface<IStatistics>>('dashboard').pipe(
      map(({responseObject}) => responseObject),
      tap((res) => {
        console.log({res})
      })
    )
  }

  categoryProjectsChartData = (statistics: IStatistics) => {
    const inputData = statistics.collectionsByCategory;
    const labels = inputData.map(item => item.category);
    const projectsData = inputData.map(item => parseInt(item.projectsInCategory, 10));

    return {
      labels: labels,
      datasets: [
        {
          data: projectsData,
          label: 'Projects in Category',
          // borderColor: 'rgba(75, 192, 192, 1)', // You can set your desired border color here
          borderWidth: 1
        }
      ]
    }
  };

  categoryValueChartData = (statistics: IStatistics) => {
    const inputData = statistics.collectionsByCategory;
    const labels = inputData.map(item => item.category);
    const projectsData = inputData.map(item => parseInt(item.categoryValue, 10));

    return {
      labels: labels,
      datasets: [
        {
          data: projectsData,
          label: 'Projects in Category',
          borderWidth: 1
        }
      ]
    }
  };

  revenueBarChartData = (statistics: IStatistics) => {

    // Define month names for formatting
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const inputData = statistics.revenueByMonth;
    const sortedData = inputData.sort((a, b) => {
      if (a.Year !== b.Year) {
        return a.Year - b.Year;
      }
      return monthNames.indexOf(a.Month) - monthNames.indexOf(b.Month);
    });
    const labels: string[] = [];
    const revenues: number[] = [];


// Iterate through the data and extract month, year, and total revenue
    sortedData.forEach(item => {
      const monthIndex = monthNames.indexOf(item.Month) + 1;
      const formattedDate = `${monthIndex.toString().padStart(2, '0')}/${(item.Year % 100).toString().padStart(2, '0')}`;

      // Add formatted date to labels array
      labels.push(formattedDate);

      // Parse total revenue as integer and add to revenues array
      revenues.push(parseInt(item.totalRevenue, 10));
    });

    return {
      labels,
      datasets: [
        {data: revenues, label: 'Revenue', backgroundColor: '#2736F6'}
      ]
    } as ChartConfiguration<'bar'>['data']
  };
}
