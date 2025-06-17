import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  public async signIn(username: string): Promise<void> {
    this.router.navigate(['/game'], { queryParams: { username } });
  }
}
