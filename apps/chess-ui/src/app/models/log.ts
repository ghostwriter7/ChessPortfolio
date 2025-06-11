export class Log {
  constructor(public readonly message: string,
              public readonly timestamp: Date = new Date()) {
  }

  public static of(message: string): Log {
    return new Log(message);
  }
}
