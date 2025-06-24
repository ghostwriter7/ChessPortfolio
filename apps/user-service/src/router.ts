import {
  AuthResponse,
  CreateUserRequest,
  ErrorResponse,
  SignInRequest,
} from '@api';
import { Request, Response, Router } from 'express';
import pool from './database';
import { UserService } from './services/user/user.service';
import { UserRepository } from './user-repository';
import { JwtService } from './services/jwt/jwt.service';
import { TokensWithUsername } from './dtos/tokens';
import { BrokerService } from './services/broker/broker.service';

const router = Router();
const jwtService = new JwtService();
const userRepository = new UserRepository(pool);
const broker = new BrokerService();
await broker.init();
const userService = new UserService(userRepository, jwtService, broker);

const aWeek = 24 * 60 * 60 * 1000 * 7;

function handleAuthResponse(
  res: Response,
  code: 200 | 201,
  { refreshToken, accessToken, username }: TokensWithUsername
): void {
  res
    .status(code)
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + aWeek),
    })
    .send(new AuthResponse(accessToken, username));
}

router.post(
  '/sign-up',
  async (req: Request<never, void | ErrorResponse, CreateUserRequest>, res) => {
    const createUserRequest = req.body;
    await userService.signUp(createUserRequest);
    res.status(201).end();
  }
);

router.post(
  '/sign-in',
  async (
    req: Request<never, AuthResponse | ErrorResponse, SignInRequest>,
    res
  ) => {
    const signInRequest = req.body;
    const response = await userService.signIn(signInRequest);
    handleAuthResponse(res, 200, response);
  }
);

router.get('/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(400).send();
  } else {
    const response = await userService.refreshTokens(refreshToken);
    handleAuthResponse(res, 200, response);
  }
});

router.get('/logout', (req, res) => {
  res
    .status(204)
    .clearCookie('refreshToken', { httpOnly: true })
    .sendStatus(204);
});

router.get('/verify/:token', async (req, res) => {
  const token = req.params['token'];

  if (!token) {
    res.status(400).send();
  } else {
    await userService.verifyEmail(token);
    res.redirect('http://localhost:4200/login');
  }
});

export default router;
