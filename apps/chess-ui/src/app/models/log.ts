import { LogCreatedEvent } from '@chess-logic';

export class Log {
  constructor(
    public readonly message: string,
    public readonly timestamp: Date = new Date()
  ) {}

  public static from({ payload, createdAt }: LogCreatedEvent): Log {
    return new Log(payload, createdAt);
  }
}
