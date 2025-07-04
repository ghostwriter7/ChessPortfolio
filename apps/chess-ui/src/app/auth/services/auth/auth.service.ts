import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SignInFormValue, SignUpFormValue } from '../../model/form';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { AuthResponse } from '@api';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from '../../../ui/alert-popup/alert-popup.component';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly $user = computed(() => this.authResponse()?.username);
  private readonly router = inject(Router);
  private readonly refreshTokenInMs = 15 * 1000 * 60;

  private readonly authResponse = signal<AuthResponse | null>(null);

  private readonly api = 'http://localhost:4201/api/auth';
  private readonly dialog = inject(MatDialog);
  private readonly httpClient = inject(HttpClient);

  public get token(): string | undefined {
    return this.authResponse()?.token;
  }

  constructor() {
    this.attemptToRefreshToken();
  }

  public logout(): void {
    this.authResponse.set(null);
    this.httpClient
      .get(`${this.api}/logout`, { withCredentials: true })
      .subscribe();
    this.router.navigate(['/auth']);
  }

  public signUp(value: SignUpFormValue): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.api}/sign-up`, value, {
        withCredentials: true,
      })
      .pipe(
        tap(() =>
          this.dialog.open(AlertPopupComponent, {
            data: {
              title: 'Confirm Your Email',
              message:
                'Your account has been created, but is inactive. Please, go to your mailbox and confirm your account.',
            },
          })
        ),
        catchError(this.handleError.bind(this))
      );
  }

  public signIn(value: SignInFormValue): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.api}/sign-in`, value, {
        withCredentials: true,
      })
      .pipe(
        tap(this.handleAuthResponse.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  private handleAuthResponse(
    authResponse: AuthResponse,
    navigateToLobby = true
  ): void {
    this.authResponse.set(authResponse);

    setTimeout(() => this.attemptToRefreshToken(false), this.refreshTokenInMs);

    if (navigateToLobby) {
      this.router.navigate(['/lobby']);
    }
  }

  private handleError(
    error: HttpErrorResponse | { message: string }
  ): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      throw new Error(error.error.message);
    }
    throw new Error(error.message);
  }

  private attemptToRefreshToken(navigateToLobby = true): void {
    this.httpClient
      .get<AuthResponse>(`${this.api}/refresh`, { withCredentials: true })
      .subscribe({
        next: (authResponse: AuthResponse) =>
          this.handleAuthResponse(authResponse, navigateToLobby),
        error: () => this.router.navigate(['/auth']),
      });
  }
}
