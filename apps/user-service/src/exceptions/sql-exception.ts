export class SqlException extends Error {
  public static readonly UNIQUE_VIOLATION = 'UNIQUE_VIOLATION';
  public static readonly UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  constructor(message: string, public readonly code: string) {
    super(message);
  }
}
