import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '@api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly $user: Signal<User | null>;
  private readonly router = inject(Router);

  private authResponse: AuthResponse | null = null;

  private readonly api = '/api/auth';
  private readonly user = signal<User | null>(null);
  private readonly httpClient = inject(HttpClient);

  constructor() {
    this.$user = this.user.asReadonly();
  }

  public signUp(username: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.api}/sign-up`, {
        username,
        password,
      })
      .pipe(tap(this.handleAuthResponse.bind(this)));
  }

  public signIn(username: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.api}/sign-in`, { username, password })
      .pipe(tap(this.handleAuthResponse.bind(this)));
  }

  private handleAuthResponse(authResponse: AuthResponse): void {
    this.authResponse = authResponse;
    this.router.navigate(['/lobby']);
  }
}
