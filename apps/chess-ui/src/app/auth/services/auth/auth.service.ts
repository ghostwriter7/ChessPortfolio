import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public signIn(username: string): Promise<void> {
    return Promise.resolve();
  }
}
