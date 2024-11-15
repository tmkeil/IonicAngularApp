import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { InstructionsPage } from './pages/instructions/instructions.page';
import { EinteilungPage } from './pages/einteilung/einteilung.page';

/*
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'instructions',
    loadComponent: () => import('./pages/instructions/instructions.page').then( m => m.InstructionsPage)
  },
  {
    path: 'einteilung',
    loadComponent: () => import('./pages/einteilung/einteilung.page').then( m => m.EinteilungPage)
  },
  {
    path: 'group/:id',
    loadComponent: () => import('./pages/group/group.page').then( m => m.GroupPage),
    children: [
      {
        path: 'employee-gr-list',
        loadComponent: () => import('./pages/employee-gr-list/employee-gr-list.page').then( m => m.EmployeeGrListPage)
      },
      {
        path: 'station-gr-list',
        loadComponent: () => import('./pages/station-gr-list/station-gr-list.page').then( m => m.StationGrListPage)
      },
      {
        path: 'quali-gr-list',
        loadComponent: () => import('./pages/quali-gr-list/quali-gr-list.page').then( m => m.QualiGrListPage)
      },
      {
        path: '',
        redirectTo: 'employee-gr-list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
*/
export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    //loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'instructions',
    component: InstructionsPage,
    //loadComponent: () => import('./pages/instructions/instructions.page').then( m => m.InstructionsPage)
  },
  {
    path: 'einteilung',
    component: EinteilungPage,
    //loadComponent: () => import('./pages/einteilung/einteilung.page').then( m => m.EinteilungPage)
  },
  {
    path: 'group/:id',
    loadChildren: () => import('./pages/group/group.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
