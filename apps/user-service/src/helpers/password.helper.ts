import crypto from 'node:crypto';

export class PasswordHelper {
  public static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  public static verifyPassword(password: string, hash: string): boolean {
    const [salt, key] = hash.split(':');
    const hashedPassword = crypto
      .scryptSync(password, salt, 64)
      .toString('hex');
    return hashedPassword === key;
  }
}
