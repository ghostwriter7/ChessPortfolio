import { Routes } from '@angular/router';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';
import { inject } from '@angular/core';
import { AuthService } from './auth/services/auth/auth.service';

const authGuard = () => !!inject(AuthService).$user();

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

    canActivate: [authGuard],
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./game/game-page/game-page.component').then(
        (m) => m.GamePageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
