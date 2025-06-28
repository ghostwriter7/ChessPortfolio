import * as winston from 'winston';

export class Logger {
  constructor(private readonly logger: winston.Logger) {}

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string, error?: unknown): void {
    this.logger.error(message, error);
  }
}
