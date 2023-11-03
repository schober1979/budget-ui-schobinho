import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { categoriesPath, defaultPath, expensesPath } from './shared/routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: defaultPath,
    pathMatch: 'full',
  },
  {
    path: categoriesPath,
    loadChildren: () => import('./category/category.module').then((m) => m.CategoryModule),
    canActivate: [AuthGuard],
    title: 'Categories | Budget UI',
  },
  {
    path: expensesPath,
    loadChildren: () => import('./expense/expense.module').then((m) => m.ExpenseModule),
    canActivate: [AuthGuard],
    title: 'Expenses | Budget UI',
  },
  {
    path: loginPath,
    component: LoginComponent
  }
  {
    path: '**',
    redirectTo: defaultPath,
  },
  {
    path: loginPath,
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
