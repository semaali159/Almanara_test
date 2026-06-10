import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shipments',
    pathMatch: 'full',
  },
  {
    path: 'shipments',
    loadComponent: () =>
      import('./features/shipments/pages/shipments-page/shipments-page.component').then(
        (m) => m.ShipmentsPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'shipments',
  },
];