import { Pool } from 'mysql2/promise';

export class UserService {
  constructor(private readonly pool: Pool) {}

  public async signUp(): Promise<void> {}

  public async signIn(): Promise<void> {}
}
