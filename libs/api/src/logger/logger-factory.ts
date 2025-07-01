import { createLogger, format, transports } from 'winston';
import { Logger } from './logger';

const { combine, timestamp, label, printf, colorize } = format;

const logFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`
);

export function loggerFactory(params?: {
  service?: string;
  level?: string;
}): Logger {
  const { service = 'Root', level = 'info' } = params ?? {};
  const logger = createLogger({
    level: level,
    format: combine(
      colorize({ all: true }),
      label({ label: service }),
      timestamp(),
      logFormat
    ),
    defaultMeta: { service },
    transports: [new transports.Console()],
  });

  return new Logger(logger);
}
