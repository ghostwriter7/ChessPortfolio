import * as jwt from 'jsonwebtoken';

export function verifyToken<T extends object>(token: string): T {
  return jwt.verify(token, process.env['JWT_SECRET'] as string) as T;
}
