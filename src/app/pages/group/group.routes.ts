import { Routes } from '@angular/router';
import { GroupPage } from './group.page';

export const routes: Routes = [
    {
        path: '',
        component: GroupPage,
        children: [
          {
            path: 'employee-gr-list',
            children:[
              {
                path: '',
                loadComponent: () => import('../employee-gr-list/employee-gr-list.page').then((m) => m.EmployeeGrListPage)
              }
            ],
          },
          {
            path: 'station-gr-list',
            children:[
              {
                path: '',
                loadComponent: () => import('../station-gr-list/station-gr-list.page').then((m) => m.StationGrListPage)
              }
            ],
          },
          {
            path: '',
            redirectTo: 'employee-gr-list',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'employee-gr-list',
        pathMatch: 'full',
      },
];
