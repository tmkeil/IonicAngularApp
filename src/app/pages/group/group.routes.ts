import { Routes } from '@angular/router';
import { GroupPage } from './group.page';
import { list } from 'ionicons/icons';

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
            path: 'quali-gr-list',
            children:[
              {
                path: '',
                loadComponent: () => import('../quali-gr-list/quali-gr-list.page').then((m) => m.QualiGrListPage)
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