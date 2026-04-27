import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/clientes').then(m => m.Clientes)
      },
      {
        path: 'cuentas',
        loadComponent: () => import('./features/cuentas/cuentas').then(m => m.Cuentas)
      },
      {
        path: 'movimientos',
        loadComponent: () => import('./features/movimientos/movimientos').then(m => m.Movimientos)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features/reportes/reportes').then(m => m.Reportes)
      }
    ]
  },
  { path: '**', redirectTo: 'clientes' } // Redirección por defecto
];
