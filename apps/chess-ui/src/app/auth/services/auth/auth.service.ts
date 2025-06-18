import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly $user: Signal<User | null>;
  private readonly router = inject(Router);

  private readonly user = signal<User | null>(null);

  constructor() {
    this.$user = this.user.asReadonly();
  }

  public async signIn(username: string): Promise<void> {
    this.user.set(new User(username));
    this.router.navigate(['/lobby']);
  }
}
