import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'temp-secret-for-dev-work';

export class JwtService {
  public generateToken<T extends object>(payload: T): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  public verifyToken<T extends object>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
  }
}
