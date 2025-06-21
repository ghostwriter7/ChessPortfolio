import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SignInFormValue, SignUpFormValue } from '../../model/form';
import { User } from '../../model/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { AuthResponse } from '@api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly $user: Signal<User | null>;
  private readonly router = inject(Router);
  private readonly refreshTokenInMs = 1000 * 55;

  private authResponse: AuthResponse | null = null;

  private readonly api = 'http://localhost:4201/api/auth';
  private readonly user = signal<User | null>(null);
  private readonly httpClient = inject(HttpClient);

  constructor() {
    this.$user = this.user.asReadonly();

    this.attemptToRefreshToken();
  }

  public signUp(value: SignUpFormValue): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.api}/sign-up`, value, {
        withCredentials: true,
      })
      .pipe(
        tap(this.handleAuthResponse.bind(this)),
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
    this.authResponse = authResponse;

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
