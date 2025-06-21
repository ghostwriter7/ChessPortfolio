import {
  AuthResponse,
  CreateUserRequest,
  ErrorResponse,
  SignInRequest,
} from '@api';
import { Request, Response, Router } from 'express';
import pool from './database';
import { UserService } from './services/user-service/user.service';
import { UserRepository } from './user-repository';
import { JwtService } from './services/jwt-service/jwt.service';
import { TokensWithUsername } from './dtos/tokens';

const router = Router();
const jwtService = new JwtService();
const userRepository = new UserRepository(pool);
const userService = new UserService(userRepository, jwtService);

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
  async (
    req: Request<never, AuthResponse | ErrorResponse, CreateUserRequest>,
    res
  ) => {
    console.log(`[POST] /sign-up`);

    const createUserRequest = req.body;
    const response = await userService.signUp(createUserRequest);
    handleAuthResponse(res, 201, response);
  }
);

router.post(
  '/sign-in',
  async (
    req: Request<never, AuthResponse | ErrorResponse, SignInRequest>,
    res
  ) => {
    console.log('[POST] /sign-in');
    const signInRequest = req.body;
    const response = await userService.signIn(signInRequest);
    handleAuthResponse(res, 200, response);
  }
);

router.get('/refresh', async (req, res) => {
  console.log('[GET] /refresh');
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(400).send();
  } else {
    const response = await userService.refreshTokens(refreshToken);
    handleAuthResponse(res, 200, response);
  }
});

router.get('/logout', (req, res) => {
  console.log('[GET] /logout');
  res
    .status(204)
    .clearCookie('refreshToken', { httpOnly: true })
    .sendStatus(204);
});

export default router;
