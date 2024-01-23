import { ActivatedRouteSnapshot, Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@mwazi/auth';
import { ProjectService } from '@mzima/shared/projects';
import { TransactionService } from '@mwazi/shared/transaction';

export const appRoutes: Route[] = [
  {
    path: '',
    canMatch: [() => !inject(AuthService).loggedIn()],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
      },
      {
        path: 'auth',
        loadComponent: () => import('@mwazi/components/auth'),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'onboarding'
          },
          {
            path: 'onboarding',
            loadComponent: () => import('@mwazi/web/pages/onboarding')
          },
          {
            path: 'login',
            canActivate: [
              () => !inject(AuthService).loggedIn() ? true : inject(Router).navigate(['dashboard'])
            ],
            loadComponent: () => import('@mwazi/pages/login')

          }
        ]
      }
    ]
  },

  {
    path: '',
    canMatch: [() => inject(AuthService).loggedIn() ? true : inject(Router).navigate(['auth'])],
    loadComponent: () => import('@mwazi/web/pages/layout'),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@mwazi/pages/dashboard')

      },
      {
        path: 'projects/create',
        loadComponent: () => import('@mwazi/web/pages/projects').then(m => m.ManageProjectComponent)

      },
      {
        path: 'users',
          loadComponent: () => import('@mwazi/web/pages/users')
      },
      {
        path: 'projects',
        loadComponent: () => import('@mwazi/web/pages/projects')
      },
      {
        path: 'projects/:projectId',
        resolve: {
          project: (route: ActivatedRouteSnapshot) =>
            inject(ProjectService).getItemBy(route.paramMap.get('projectId'))
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () => import('@mwazi/web/pages/projects').then(m => m.ViewProjectComponent)
          },
          {
            path: 'edit',
            loadComponent: () => import('@mwazi/web/pages/projects').then(m => m.ManageProjectComponent)
          },
          {
            path: 'transactions/:transactionId',
            resolve: {
              transaction: (route: ActivatedRouteSnapshot) =>
                inject(TransactionService).getItemBy(route.paramMap.get('transactionId'))
            },
            loadComponent: () => import('@mwazi/web/pages/transactions').then(m => m.ViewTransactionComponent)
          }
        ]
      },
      {
        path: 'projects/report/:projectLink',
        loadComponent: () => import('@mwazi/web/pages/projects').then(m => m.ViewProjectReportComponent)

      },
      {
        path: 'settings',
        loadComponent: () => import('@mwazi/web/pages/settings')

      }
    ]
  }


];
