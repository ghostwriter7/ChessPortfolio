import * as jwt from 'jsonwebtoken';
import { type StringValue } from 'ms';
import { Tokens } from '../../dtos/tokens';

const JWT_SECRET = 'temp-secret-for-dev-work';

export class JwtService {
  public generateAuthTokens(userId: number): Tokens {
    return {
      accessToken: this.generateToken({ userId }, '1h'),
      refreshToken: this.generateToken({ userId }, '7d'),
    };
  }

  public generateToken<T extends object>(
    payload: T,
    expiresIn: StringValue
  ): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  public verifyToken<T extends object>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
  }
}
