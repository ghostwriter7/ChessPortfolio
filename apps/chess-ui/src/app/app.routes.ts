import { Routes } from '@angular/router';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./game/game-page/game-page.component').then(
        (m) => m.GamePageComponent
      ),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
