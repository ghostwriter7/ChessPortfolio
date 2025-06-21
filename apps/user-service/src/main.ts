import express from 'express';
import router from './router';
import { initializeDatabase } from './database';
import cors from 'cors';
import { BadRequestException } from './exceptions/bad-request-exception';
import { UnauthorizedException } from './exceptions/unauthorized-exception';
import cookieParser from 'cookie-parser';

const app = express();

await initializeDatabase();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
app.use((err: Error, req, res, next) => {
  if (err instanceof BadRequestException) {
    res.status(400).json({ message: err.message });
  } else if (err instanceof UnauthorizedException) {
    res.status(401).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const port = process.env.PORT || 4201;
const server = app.listen(port, () => {
  console.log(`User-Service Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
