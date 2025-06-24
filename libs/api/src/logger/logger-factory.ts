import { createLogger, format, transports } from 'winston';
import { Logger } from './logger';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`
);

export function loggerFactory({
  service,
  level = 'info',
}: {
  service: string;
  level?: string;
}): Logger {
  const logger = createLogger({
    level: level,
    format: combine(label({ label: service }), timestamp(), logFormat),
    defaultMeta: { service },
    transports: [new transports.Console()],
  });

  return new Logger(logger);
}
