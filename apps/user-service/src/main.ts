import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import * as jwt from 'jsonwebtoken';
import { initializeDatabase } from './database';
import { BadRequestException } from './exceptions/bad-request-exception';
import { InternalServerException } from './exceptions/internal-server-exception';
import { UnauthorizedException } from './exceptions/unauthorized-exception';
import router from './router';
import { ForbiddenException } from './exceptions/forbidden-exception';
import { loggerFactory, loggingMiddlewareFactory, retry } from '@api';

const app = express();

const logger = loggerFactory();
await retry(async () => await initializeDatabase(logger), logger);

app.use(loggingMiddlewareFactory(logger));
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
app.use((err: Error, req, res, next) => {
  if (err instanceof BadRequestException) {
    res.status(400).json({ message: err.message });
  } else if (
    err instanceof UnauthorizedException ||
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.JsonWebTokenError
  ) {
    res.status(401).json({ message: err.message });
  } else if (err instanceof ForbiddenException) {
    res.status(403).json({ message: err.message });
  } else if (err instanceof InternalServerException) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  logger.info(`User-Service is running on port ${PORT}`);
});
server.on('error', console.error);
