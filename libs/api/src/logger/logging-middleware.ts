import { Logger } from './logger';
import { NextFunction, Request, Response } from 'express';

export const loggingMiddlewareFactory =
  (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const startTime = Date.now();
    const commonMessage = `${method} ${url}`;

    res.on('finish', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      logger.info(`${commonMessage} | ${res.statusCode} | ${duration}ms`);
    });

    logger.info(commonMessage);
    next();
  };
