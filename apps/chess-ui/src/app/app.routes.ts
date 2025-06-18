import { Routes } from '@angular/router';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'lobby',
    loadComponent: () =>
      import('./lobby/lobby-page/lobby-page.component').then(
        (m) => m.LobbyPageComponent
      ),
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
