import * as jwt from 'jsonwebtoken';
import { type StringValue } from 'ms';
import { Tokens } from '../../dtos/tokens';
import { verifyToken } from '@api';

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
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  public verifyToken<T extends object>(token: string): T {
    return verifyToken<T>(token);
  }
}
