import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { EinteilungPage } from './pages/einteilung/einteilung.page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    //loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
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
